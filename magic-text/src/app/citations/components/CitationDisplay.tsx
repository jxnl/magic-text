import { useMemo, useState } from "react";

type ICitationLocation = [number, number];

type ICitationData = {
  body: string;
  spans: ICitationLocation[];
  citation: string[];
};

const Citation = ({
  citation,
  onHover,
}: {
  citation: ICitationData;
  onHover: (location: ICitationLocation[]) => void;
}) => {
  return (
    <span
      onMouseEnter={() => onHover(citation.spans)}
      onMouseLeave={() => onHover([])}
      className="cursor-pointer block hover:underline-offset-1 hover:underline"
    >
      {citation.body}{" "}
    </span>
  );
};

const CitationDisplay = ({
  context,
  citations,
}: {
  context: string;
  citations: ICitationData[];
}) => {
  const [highlight, setHighlight] = useState<ICitationLocation[]>([]);

  const highlightedContext = useMemo(() => {
    if (highlight.length === 0) {
      return context;
    }
    let result = context;
    for (let loc of highlight) {
      result =
        result.slice(0, loc[0]) +
        `<mark class="bg-red-900 py-1 font-medium text-slate-100">` +
        result.slice(loc[0], loc[1]) +
        "</mark>" +
        result.slice(loc[1]);
    }
    return result;
  }, [context, highlight]);

  return (
    <div className="prose">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 sm:p-6">
          {citations.length > 0 ? (
            <>
              <b className="text-base font-semibold leading-6 text-gray-900">
                Statements
              </b>
            </>
          ) : (
            <b>Loading...</b>
          )}
          <ul className="pb-2 list-disc list-outside">
            {citations.map((c) => (
              <li>
                <Citation key={c.body} citation={c} onHover={setHighlight} />
              </li>
            ))}
          </ul>
          <b className="font-semibold leading-6 text-gray-900">
            Context with highlights
          </b>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p
              className="text-gray-900 placeholder:text-gray-900 sm:leading-6 "
              dangerouslySetInnerHTML={{ __html: highlightedContext }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { CitationDisplay };
