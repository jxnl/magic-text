import {ICitationData, ICitationLocation} from "@/app/api/exact_citations/route";
import {useMemo, useState} from "react";

const Citation = ({citation, onHover}: {
  citation: ICitationData,
  onHover: (location: ICitationLocation[]) => void
}) => {
  return (
    <span
      onMouseEnter={() => onHover(citation.spans)}
      onMouseLeave={() => onHover([])}
      className="cursor-pointer block"
    >{citation.body}</span>
  )
}

const CitationDisplay = ({context, citations}: {
  context: string,
  citations: ICitationData[],
}) => {
  const [highlight, setHighlight] = useState<ICitationLocation[]>([])

  const highlightedContext = useMemo(() => {
    if (highlight.length === 0) {
      return context
    }
    let result = context
    for (let loc of highlight) {
      result = result.slice(0, loc[0]) + "<mark>" + result.slice(loc[0], loc[1]) + "</mark>" + result.slice(loc[1])
    }
    return result
  }, [context, highlight])

  return (
    <div className="border-2 border-b border-transparent p-3">
      <div
        className="pb-2 text-gray-900 placeholder:text-gray-900 sm:text-sm sm:leading-6 font-mono"
        dangerouslySetInnerHTML={{__html: highlightedContext}}
      />
      {citations.map(c => (
        <Citation
          key={c.body}
          citation={c}
          onHover={setHighlight}
        />
      ))}
    </div>
  )
}

export {CitationDisplay}