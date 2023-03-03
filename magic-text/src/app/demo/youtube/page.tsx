"use client";

import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useSearchParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleCard from "../components/TitleCard";
import {
  parseChaptersFromSummary,
  cachedSummary,
  isValidYoutubeUrl,
  extractVideoId,
} from "./utils";
import { Youtube } from "./youtube";

export const dynamic = "force-dynamic";

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

  const generateSummary = async (e: any) => {
    e.preventDefault;

    // use regex to check if url is youtube linke
    if (!isValidYoutubeUrl(url)) {
      toast.error("Please enter a valid youtube url");
      return;
    }

    setStart(true);
    setLoading(true);

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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setSummary((prev) => (prev + chunkValue).trim());
    }

    toast.success("Summary completed!");
    setLoading(false);
  };

  // I believe this is the same as componentDidMount
  // if there is a videoId in the url, set the url to the videoId
  // and check if there is a cached summary, if so, set the summary
  const videoId = useSearchParams().get("v");
  useEffect(() => {
    if (videoId) {
      setUrl("https://www.youtube.com/watch?v=" + videoId);
      setStart(true);
      cachedSummary(videoId).then((res) => {
        setSummary(res.summary_markdown);
      });
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
        description="
          Generate a summary of a youtube video. Once the summary is generated, you can click on the chapter links to jump to that part of the video. 
          If you want, copy the chapters and paste them into the youtube comments to create a table of contents for your video."
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
          {/* 
          I use react markdown to render the summary, and I use a custom link renderer to render the [00:00:00](url) 
          as a link that will set the timestamp in the youtube video so it looks like `# title` where # is a blue link
          using tailwind prose to style the markdown is also very nice.
          */}
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
          <div className="flex mt-6 space-x-3 mb-10">
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
            {/* 
              I also have a button to copy the chapters to the clipboard, which is just the titles of the summary
              Which is useful for people who want to copy the chapters and leave a comment on the video. 
              When they do that, the chapters will automatically allow other users to jump to that chapter. (on youtube)
            */}
            <Button
              name="Copy Chapters"
              loading={loading}
              onClick={() => {
                if (summary.length === 0) {
                  toast.error("Please generate a summary first");
                  return;
                }

                const chapters = parseChaptersFromSummary(summary);
                navigator.clipboard.writeText(chapters);
                toast.success("Copied to clipboard!");
              }}
            />
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
          </div>
        </>
      ) : null}
    </>
  );
}
