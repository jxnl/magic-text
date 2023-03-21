import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast } from "react-toastify";
import { parseChaptersFromSummary, extractVideoId } from "../utils";
export default function Divider({
  summary,
  url,
  shortenFn,
}: {
  summary: string;
  url: string;
  shortenFn: (e: any) => void;
}): JSX.Element {
  let summaryClean = summary;
  return (
    <div className="relative py-10">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center space-x-5">
        <button
          type="button"
          data-te-toggle="tooltip-donate"
          title="Support this project so we can keep it free and open source"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <ClipboardDocumentIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Link href="https://www.buymeacoffee.com/jxnl" target="_blank">
            Donate
          </Link>
        </button>
        {summaryClean.length > 0 ? (
          <button
            type="button"
            title="Shorten the summary again"
            className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={(e) => {
              toast.success("Shortening the summary again...");
              shortenFn(e);
            }}
          >
            <ClipboardDocumentIcon
              className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Shorten
          </button>
        ) : null}
        <button
          type="button"
          title="Copy the summary markdown to your clipboard"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (summaryClean.length === 0) {
              toast.error("Please generate a summary first");
              return;
            }
            navigator.clipboard.writeText(summaryClean);
            toast.success("Copied the markdown summary to clipboard!");
          }}
        >
          <ClipboardDocumentIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Copy Summary
        </button>
        <button
          type="button"
          title="Copy the chapters markdown to your clipboard, leave this as a comment on the video to automatically generate chapters for everyone who watches the video"
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
            toast.success(
              `Copied formatted chapters for this YouTube video! Share the love and leave them as a comment to help others add structure to the content`
            );
          }}
        >
          <ClipboardDocumentListIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Copy Chapters
        </button>
        <button
          type="button"
          title="Copy the link to this summary to your clipboard"
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
            toast.success("Link copied a shareable magic link to clipboard!");
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
