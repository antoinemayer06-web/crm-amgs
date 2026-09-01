import ReactMarkdown from 'react-markdown'

const components = {
  h1: (props) => <h1 className="mb-2 mt-4 text-xl font-semibold text-neutral-900 first:mt-0" {...props} />,
  h2: (props) => <h2 className="mb-2 mt-4 text-lg font-semibold text-neutral-900 first:mt-0" {...props} />,
  h3: (props) => <h3 className="mb-1 mt-3 text-base font-semibold text-neutral-900 first:mt-0" {...props} />,
  p: (props) => <p className="mb-3 text-sm leading-relaxed text-neutral-700 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-neutral-700" {...props} />,
  ol: (props) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-neutral-700" {...props} />,
  li: (props) => <li {...props} />,
  strong: (props) => <strong className="font-semibold text-neutral-900" {...props} />,
  em: (props) => <em {...props} />,
  a: (props) => (
    <a className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noreferrer" {...props} />
  ),
  code: (props) => <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs" {...props} />,
  blockquote: (props) => (
    <blockquote className="mb-3 border-l-2 border-neutral-300 pl-3 text-sm italic text-neutral-500" {...props} />
  ),
  hr: () => <hr className="my-4 border-neutral-200" />,
}

export default function MarkdownContent({ content }) {
  if (!content?.trim()) {
    return <p className="text-sm text-neutral-400">Aucun contenu.</p>
  }

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>
}
