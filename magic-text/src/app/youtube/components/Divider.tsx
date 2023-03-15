import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { parseChaptersFromSummary, extractVideoId } from "../utils";
export default function Divider({
  summary,
  url,
}: {
  summary: string;
  url: string;
}) {
  let summaryClean = summary;
  return (
    <div className="relative py-10">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center space-x-5">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (summaryClean.length === 0) {
              toast.error("Please generate a summary first");
              return;
            }
            navigator.clipboard.writeText(summaryClean);
            toast.success("Copied to clipboard!");
          }}
        >
          <ClipboardDocumentIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Summary
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (summaryClean.length === 0) {
              toast.error("Please generate a summary first");
              return;
            }

            const chapters = parseChaptersFromSummary(summaryClean);
            navigator.clipboard.writeText(
              chapters +
                `\n\nPowered by https://magic.jxnl.co/demo/youtube?v=${extractVideoId(
                  url
                )}`
            );
            toast.success("Copied to clipboard!");
          }}
        >
          <ClipboardDocumentListIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Chapters
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (summaryClean.length === 0) {
              toast.error("Please generate a summary first");
              return;
            }
            const videoId = extractVideoId(url);
            navigator.clipboard.writeText(
              `https://magic.jxnl.co/youtube?v=${videoId}`
            );
            toast.success("Link copied to clipboard!");
          }}
        >
          <ArrowUpOnSquareIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Share
        </button>
      </div>
    </div>
  );
}
