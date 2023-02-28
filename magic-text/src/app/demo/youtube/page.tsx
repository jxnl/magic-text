"use client";

import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { extractVideoId, Youtube } from "./youtube";
import { useSearchParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleCard from "../components/TitleCard";

export const dynamic = "forced-dynamic";

async function cachedSummary(videoId: string) {
  console.log("checking for cached summary");

  // check if there is a cached summary with ?v=videoId
  const response = fetch("/api/cached_summary?v=" + videoId, {
    next: { revalidate: 0 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return response;
}

// regex to check if url is youtube link
const regex = new RegExp(
  "^(https?:\\/\\/)?((w){3}.)?youtu(be|.be)?(\\.com)?\\/.+"
);

function Button(props: { loading: boolean; onClick: any; name: string }) {
  const { loading, onClick, name } = props;
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
    >
      {name}
    </button>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [shortened, setShortened] = useState(false);
  const [started, setStart] = useState(false);
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
          setTs(_ts);
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
      toast.error("Error generating summary.");
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

    toast.success("Summary completed!");
    setLoading(false);
  };

  const videoId = useSearchParams().get("v");

  useEffect(() => {
    if (videoId) {
      console.log("videoId", videoId);
      setUrl("https://www.youtube.com/watch?v=" + videoId);
      setStart(true);
      // check if there is a cached summary with ?v=videoId
      cachedSummary(videoId).then((res) => {
        setSummary(res.summary_markdown);
      });
    } else {
      console.log("no videoId");
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme="light"
      />
      <TitleCard
        title="Youtube"
        description="Turn any youtube video into study notes. Just paste the url and click generate. You can also shorten the copy the markdown or shorten the summary."
      />
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
        <Button loading={loading} name="Generate" onClick={generateSummary} />
      </div>
      {started ? (
        <>
          <hr className="h-px my-10 bg-gray-200 border-0"></hr>
          <Youtube url={url} ts={ts} />
          <hr className="h-px my-10 bg-gray-200 border-0"></hr>
          <article className="prose prose-headings:text-2xl prose-blue w-full border-red-100">
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
      ) : null}
      <div className="flex mt-6 space-x-3 mb-10">
        {started ? (
          <Button
            name="Copy"
            loading={loading}
            onClick={() => {
              if (summary.length === 0) {
                toast.error("Please generate a summary first");
                return;
              }
              navigator.clipboard.writeText(summary);
              toast.success("Copied to clipboard!");
            }}
          />
        ) : null}
        {started ? (
          <Button
            name="Share"
            loading={loading}
            onClick={() => {
              if (summary.length === 0) {
                toast.error("Please generate a summary first");
                return;
              }
              const videoId = extractVideoId(url);
              navigator.clipboard.writeText(
                `https://magic.jxnl.co/demo/youtube?v=${videoId}`
              );
              toast.success("Link copied to clipboard!");
            }}
          />
        ) : null}
        {started ? (
          <Button
            loading={loading}
            name="Shorten"
            onClick={generateShortened}
          />
        ) : null}
      </div>
    </>
  );
}
