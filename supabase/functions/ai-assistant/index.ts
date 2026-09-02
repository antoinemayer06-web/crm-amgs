import { createClient } from 'npm:@supabase/supabase-js@2'
import Anthropic from 'npm:@anthropic-ai/sdk@0.122.0'
import { corsHeaders } from './cors.ts'
import { READ_TOOLS } from './readTools.ts'
import { WRITE_TOOLS } from './writeTools.ts'
import { buildContextBlock } from './context.ts'
import { buildSystemPrompt } from './systemPrompt.ts'

const MODEL = 'claude-sonnet-4-6'
const MAX_ITERATIONS = 6

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

// Nécessaire quand la clé API est une clé personnelle liée à plusieurs
// workspaces (erreur "anthropic-workspace-id is required..." sinon).
// Optionnel : absent, aucun header n'est envoyé.
const WORKSPACE_ID = Deno.env.get('ANTHROPIC_WORKSPACE_ID')
const REQUEST_OPTIONS = WORKSPACE_ID
  ? { headers: { 'anthropic-workspace-id': WORKSPACE_ID } }
  : undefined

const READ_TOOL_MAP = Object.fromEntries(READ_TOOLS.map((t) => [t.name, t]))
const WRITE_TOOL_MAP = Object.fromEntries(WRITE_TOOLS.map((t) => [t.name, t]))
const WRITE_TOOL_NAMES = new Set(WRITE_TOOLS.map((t) => t.name))
const API_TOOLS = [...READ_TOOLS, ...WRITE_TOOLS].map(({ name, description, input_schema }) => ({
  name,
  description,
  input_schema,
}))

// Un fichier joint (image ou PDF, en base64) devient un bloc de contenu
// avant le texte du message, comme attendu par l'API Messages.
function buildUserContent(message: string, attachment?: { mediaType: string; dataBase64: string } | null) {
  if (!attachment) return message

  const isPdf = attachment.mediaType === 'application/pdf'
  return [
    {
      type: isPdf ? 'document' : 'image',
      source: { type: 'base64', media_type: attachment.mediaType, data: attachment.dataBase64 },
    },
    { type: 'text', text: message },
  ]
}

// Boucle agentique : exécute les tools de lecture immédiatement, s'arrête
// dès qu'un tool d'écriture est demandé (ces actions attendent la
// validation de l'utilisateur — voir resolveActions ci-dessous).
async function runTurn(supabase: any, messages: any[], systemText: string) {
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 4096,
        thinking: { type: 'adaptive' },
        system: systemText,
        tools: API_TOOLS as any,
        messages,
      },
      REQUEST_OPTIONS,
    )

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason !== 'tool_use') {
      return { messages, pendingActions: [], pendingReadResults: [] }
    }

    const toolUseBlocks = response.content.filter((b: any) => b.type === 'tool_use') as any[]
    const toolResults: any[] = []
    const pendingActions: any[] = []

    for (const block of toolUseBlocks) {
      if (WRITE_TOOL_NAMES.has(block.name)) {
        const tool = WRITE_TOOL_MAP[block.name]
        const description = await tool.describe(supabase, block.input)
        const { data: logRow, error } = await supabase
          .from('ai_actions_log')
          .insert({
            action_type: block.name,
            description,
            payload: block.input,
            tool_use_id: block.id,
            statut: 'proposée',
          })
          .select('id')
          .single()
        if (error) throw error
        pendingActions.push({
          tool_use_id: block.id,
          log_id: logRow.id,
          action_type: block.name,
          description,
          payload: block.input,
        })
      } else {
        const tool = READ_TOOL_MAP[block.name]
        let content: string
        try {
          const result = tool ? await tool.execute(supabase, block.input) : { error: 'Tool inconnu' }
          content = JSON.stringify(result)
        } catch (err) {
          content = JSON.stringify({ error: String((err as Error)?.message ?? err) })
        }
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content })
      }
    }

    if (pendingActions.length > 0) {
      // On ne peut pas continuer la conversation tant que ces actions ne
      // sont pas validées/rejetées — on garde les tool_result de lecture
      // déjà calculés pour les renvoyer groupés au moment de la résolution.
      return { messages, pendingActions, pendingReadResults: toolResults }
    }

    messages.push({ role: 'user', content: toolResults })
  }

  return { messages, pendingActions: [], pendingReadResults: [] }
}

async function resolveActions(
  supabase: any,
  messages: any[],
  decisions: { tool_use_id: string; approved: boolean }[],
  pendingReadResults: any[],
  systemText: string,
) {
  const toolResults: any[] = [...(pendingReadResults ?? [])]

  for (const decision of decisions) {
    const { data: logRow, error: fetchError } = await supabase
      .from('ai_actions_log')
      .select('*')
      .eq('tool_use_id', decision.tool_use_id)
      .single()

    if (fetchError || !logRow) {
      toolResults.push({
        type: 'tool_result',
        tool_use_id: decision.tool_use_id,
        content: JSON.stringify({ error: 'Action introuvable' }),
        is_error: true,
      })
      continue
    }

    if (!decision.approved) {
      await supabase.from('ai_actions_log').update({ statut: 'rejetée' }).eq('id', logRow.id)
      toolResults.push({
        type: 'tool_result',
        tool_use_id: decision.tool_use_id,
        content: JSON.stringify({ success: false, rejected_by_user: true }),
      })
      continue
    }

    const tool = WRITE_TOOL_MAP[logRow.action_type]
    try {
      const result = await tool.execute(supabase, logRow.payload)
      await supabase
        .from('ai_actions_log')
        .update({ statut: 'validée', validated_at: new Date().toISOString(), result })
        .eq('id', logRow.id)
      toolResults.push({
        type: 'tool_result',
        tool_use_id: decision.tool_use_id,
        content: JSON.stringify({ success: true, ...result }),
      })
    } catch (err) {
      // Échec d'exécution après validation (ex: contrainte en base) : on ne
      // marque pas l'action comme rejetée, elle reste "proposée" pour que
      // l'utilisateur puisse réessayer.
      toolResults.push({
        type: 'tool_result',
        tool_use_id: decision.tool_use_id,
        content: JSON.stringify({ success: false, error: String((err as Error)?.message ?? err) }),
        is_error: true,
      })
    }
  }

  messages.push({ role: 'user', content: toolResults })
  return await runTurn(supabase, messages, systemText)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const contextBlock = await buildContextBlock(supabase, body.context)
    const systemText = buildSystemPrompt(contextBlock)
    let result: { messages: any[]; pendingActions: any[]; pendingReadResults: any[] }

    if (body.mode === 'resolve') {
      const messages = body.history ?? []
      result = await resolveActions(supabase, messages, body.decisions ?? [], body.pendingReadResults ?? [], systemText)
    } else {
      const messages = body.history ?? []
      messages.push({ role: 'user', content: buildUserContent(body.message, body.attachment) })
      result = await runTurn(supabase, messages, systemText)
    }

    return new Response(
      JSON.stringify({
        history: result.messages,
        pendingActions: result.pendingActions,
        pendingReadResults: result.pendingReadResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String((err as Error)?.message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
