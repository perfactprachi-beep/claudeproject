interface SearchHighlightProps {
  text: string
  query: string
}

export function SearchHighlight({ text, query }: SearchHighlightProps) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>

  const lower    = text.toLowerCase()
  const lowerQ   = trimmed.toLowerCase()
  const matchIdx = lower.indexOf(lowerQ)

  if (matchIdx === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, matchIdx)}
      <strong className="font-bold text-gray-900">
        {text.slice(matchIdx, matchIdx + lowerQ.length)}
      </strong>
      {text.slice(matchIdx + lowerQ.length)}
    </>
  )
}
