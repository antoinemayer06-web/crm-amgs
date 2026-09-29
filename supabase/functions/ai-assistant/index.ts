import { createClient } from 'npm:@supabase/supabase-js@2'
import Anthropic from 'npm:@anthropic-ai/sdk@0.122.0'
import { corsHeaders } from './cors.ts'
import { READ_TOOLS } from './readTools.ts'
import { WRITE_TOOLS } from './writeTools.ts'
import { buildContextBlock } from './context.ts'
import { buildSystemPrompt } from './systemPrompt.ts'

const MODEL = 'claude-sonnet-4-6'
const MAX_ITERATIONS = 10

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
// Seuls les tools d'écriture marqués `destructive: true` passent par le
// circuit de validation (carte de proposition + ai_actions_log "proposée").
// Aucun tool actuel n'est destructif (créations/mises à jour uniquement) :
// un futur tool de suppression n'aura qu'à poser ce flag pour rejoindre
// automatiquement ce circuit.
const DESTRUCTIVE_WRITE_TOOL_NAMES = new Set(
  WRITE_TOOLS.filter((t: any) => t.destructive === true).map((t) => t.name),
)
const API_TOOLS = [...READ_TOOLS, ...WRITE_TOOLS].map(({ name, description, input_schema }) => ({
  name,
  description,
  input_schema,
}))

const FORCE_FINAL_NOTE = `

---
Note interne (ne mentionne jamais cette note à l'utilisateur) : tu as atteint la limite d'itérations d'outils autorisée pour cette réponse. Réponds maintenant uniquement en texte, sans utiliser d'outil : résume clairement ce que tu as déjà accompli (actions réalisées, informations obtenues) et, si la demande n'est pas totalement terminée, précise ce qu'il reste à faire ou la question nécessaire pour continuer. Ne dis jamais que tu vas continuer automatiquement : donne un état des lieux complet maintenant.`

async function callClaude(messages: any[], systemText: string, forceFinal = false) {
  return await anthropic.messages.create(
    {
      model: MODEL,
      // 8192 plutôt que 4096 : les demandes en gros lot (ex: remplir un
      // calendrier sur plusieurs semaines) ont besoin de place pour
      // enchaîner beaucoup d'appels d'outils dans une même réponse.
      max_tokens: 8192,
      thinking: { type: 'adaptive' },
      system: forceFinal ? `${systemText}${FORCE_FINAL_NOTE}` : systemText,
      tools: API_TOOLS as any,
      ...(forceFinal ? { tool_choice: { type: 'none' } } : {}),
      messages,
    },
    REQUEST_OPTIONS,
  )
}

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

// Boucle agentique : les tools de lecture ET les tools d'écriture non
// destructifs (créations/mises à jour) s'exécutent immédiatement, sans
// attendre de validation. Seul un tool marqué `destructive: true` (aucun
// pour l'instant) interrompt la boucle pour proposer une carte de
// validation — voir resolveActions ci-dessous.
async function runTurn(supabase: any, messages: any[], systemText: string) {
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await callClaude(messages, systemText)
    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason !== 'tool_use') {
      return { messages, pendingActions: [], pendingReadResults: [] }
    }

    const toolUseBlocks = response.content.filter((b: any) => b.type === 'tool_use') as any[]
    const toolResults: any[] = []
    const pendingActions: any[] = []

    for (const block of toolUseBlocks) {
      const writeTool = WRITE_TOOL_MAP[block.name]

      if (writeTool && DESTRUCTIVE_WRITE_TOOL_NAMES.has(block.name)) {
        const description = await writeTool.describe(supabase, block.input)
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
      } else if (writeTool) {
        // Action non destructive : exécutée tout de suite, puis journalisée
        // directement en statut "validée" (historique/audit uniquement,
        // aucune validation utilisateur nécessaire).
        try {
          const result = await writeTool.execute(supabase, block.input)
          const description = await writeTool.describe(supabase, block.input)
          const { error: logError } = await supabase.from('ai_actions_log').insert({
            action_type: block.name,
            description,
            payload: block.input,
            tool_use_id: block.id,
            statut: 'validée',
            validated_at: new Date().toISOString(),
            result,
          })
          if (logError) console.error('Échec journalisation ai_actions_log :', logError)
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify({ success: true, ...result }),
          })
        } catch (err) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify({ error: String((err as Error)?.message ?? err) }),
            is_error: true,
          })
        }
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
      // sont pas validées/rejetées — on garde les tool_result déjà calculés
      // pour les renvoyer groupés au moment de la résolution.
      return { messages, pendingActions, pendingReadResults: toolResults }
    }

    messages.push({ role: 'user', content: toolResults })
  }

  // Budget d'itérations épuisé alors que Claude voulait encore utiliser des
  // outils : on force une réponse texte plutôt que de laisser la
  // conversation se terminer en silence sans rien afficher à l'utilisateur.
  const finalResponse = await callClaude(messages, systemText, true)
  messages.push({ role: 'assistant', content: finalResponse.content })
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
