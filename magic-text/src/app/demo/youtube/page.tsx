"use client";

import Link from "next/link";
import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Youtube } from "./youtube";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// regex to check if url is youtube link
const regex = new RegExp(
  "^(https?:\\/\\/)?((w){3}.)?youtu(be|.be)?(\\.com)?\\/.+"
);

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [shortened, setShortened] = useState(false);
  const [start, setStart] = useState(false);
  const [url, setUrl] = useState("");
  const [ts, setTs] = useState(0);

  function LinkRenderer(props: any) {
    const href = props.href;

    // extract the ts from the youtube href
    // t=1234s where ts = 1234
    const regex = new RegExp("t=(\\d+)s");
    const _ts = parseInt(href.match(regex)[1]);

    return (
      <a
        className="no-underline hover:opacity-80"
        onClick={() => {
          console.log("href", href);
          setTs(_ts);
          console.log("setting ts", _ts);
        }}
      >
        #
      </a>
    );
  }

  const generateShortened = async (e: any) => {
    e.preventDefault;

    if (summary.length == 0) {
      toast.error("There needs needs to be a summary first.");
    }

    if (shortened) {
      toast.error("Already shortened.");
      return;
    }

    setStart(true);
    setLoading(true);
    setShortened(true);
    const content = summary;
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        use_sse: true,
      }),
    });
    console.log("Edge function returned.");
    console.log(response);

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    var _fillText = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      _fillText += chunkValue;
      setSummary(_fillText.trim());
    }

    toast.success("Shortening completed!");
    setLoading(false);
  };

  const generateSummary = async (e: any) => {
    e.preventDefault;

    // use regex to check if url is youtube linke
    if (!regex.test(url)) {
      toast.error("Please enter a valid youtube url");
      return;
    }

    setStart(true);
    setLoading(true);
    setShortened(false);
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
      }),
    });
    console.log("Edge function returned.");
    console.log(response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    var _fillText = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      _fillText += chunkValue;
      setSummary(_fillText.trim());
    }

    toast.success("Summary completed!");
    setLoading(false);
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        <Link href="/">Magic</Link> Youtube by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        Input a youtube video url and get a summary in markdown format. If it
        does not have a transcript, it will use whisper but it may be less
        accurate than the transcript and will take longer to generate. Click the{" "}
        {"#"} to jump to the timestamp in the youtube video. Click Copy to copy
        the summary to your clipboard as markdown.
      </p>
      {start && (
        <>
          <hr className="h-px my-10 bg-gray-200 border-0"></hr>
          <Youtube url={url} ts={ts} />
          <hr className="h-px my-10 bg-gray-200 border-0"></hr>
          <article
            className="prose prose-headings:text-2xl 
      prose-blue
      "
          >
            <ReactMarkdown
              components={{
                a: LinkRenderer,
              }}
            >
              {summary}
            </ReactMarkdown>
          </article>
          <hr className="h-px my-10 bg-gray-200 border-0"></hr>
        </>
      )}
      <div className="flex mt-6 space-x-3 mb-10">
        <input
          value={url}
          disabled={loading}
          placeholder="https://www.youtube.com/watch?v=12345678"
          className="flex-1 rounded-lg text-md border-gray-00  text-gray-900 bg-gray-50 p-2 border-2 disabled:opacity-60"
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <button
          onClick={(e) => generateSummary(e)}
          disabled={loading}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Generate
        </button>
        <button
          disabled={loading}
          onClick={() => {
            if (summary.length === 0) {
              toast.error("Please generate a summary first");
              return;
            }
            navigator.clipboard.writeText(summary);
            toast.success("Copied to clipboard!");
          }}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Copy
        </button>
        {start && (
          <button
            disabled={loading}
            onClick={(e) => {
              generateShortened(e);
            }}
            className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
          >
            Shorten
          </button>
        )}
      </div>
    </div>
  );
}
