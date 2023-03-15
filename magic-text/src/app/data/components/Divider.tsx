import {
  ArrowUpOnSquareIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
export default function Divider({
  query,
  schema,
}: {
  query: string;
  schema: string;
}) {
  return (
    <div className="relative py-5">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center space-x-5">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (query.length === 0) {
              toast.error("Please generate a query first");
              return;
            }
            navigator.clipboard.writeText(
              query + `\n\n-- Powered by https://magic.jxnl.co/data`
            );
            toast.success("Copied to clipboard!");
          }}
        >
          <ClipboardDocumentIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Query
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (schema.length === 0) {
              toast.error("Please generate a schema first");
              return;
            }

            navigator.clipboard.writeText(
              schema + `\n\n-- Powered by https://magic.jxnl.co/data`
            );
            toast.success("Copied to clipboard!");
          }}
        >
          <ClipboardDocumentListIcon
            className="-ml-1 -mr-0.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Schema
        </button>
      </div>
    </div>
  );
}
