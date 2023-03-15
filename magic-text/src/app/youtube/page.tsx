"use client";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ReactMarkdown from "react-markdown";

import "react-toastify/dist/ReactToastify.css";

import Divider from "./components/Divider";
import Youtube from "./components/Youtube";
import { cachedSummary, isValidYoutubeUrl } from "./utils";

export default function Example() {
  const [started, setStart] = useState(false);
  const [url, setUrl] = useState("");
  const urlRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
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

    if (!urlRef.current) {
      toast.error("Please enter a valid youtube url");
      return;
    }

    // @ts-ignore
    const currentUrl = urlRef.current.value as string;

    // use regex to check if url is youtube linke
    if (!isValidYoutubeUrl(currentUrl)) {
      toast.error("Please enter a valid youtube url");
      return;
    }

    setStart(true);
    setSummary("");
    setLoading(true);
    setUrl(currentUrl);

    const response = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: currentUrl,
      }),
    });
    console.log("Edge function returned.");
    console.log(response);

    if (!response.ok) {
      toast.error("Error generating summary.");
      setLoading(false);
      throw new Error(response.statusText);
    } else {
      toast.success("Generating Summary!");
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
      setSummary((prev) => (prev + " " + chunkValue).trim());
    }

    toast.success("Summary completed!");
    setLoading(false);
    console.log("Summary completed!", summary);
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
      <ToastContainer />
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-20 lg:pb-56 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Youtube University
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Bringing together the worlds of video content and note-taking,
              Magic YouTube is the ultimate tool for extracting knowledge from
              online resources.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Youtube Link
                </label>
                <input
                  type="text"
                  name="url"
                  id="url"
                  ref={urlRef}
                  size={40}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 lg:text-base"
                  placeholder="https://www.youtube.com/watch?v=1234567890"
                />
              </div>
              <button
                onClick={generateSummary}
                disabled={loading}
                type="button"
                className="rounded-md bg-red-600 py-2 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-80"
              >
                Go!
              </button>
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 my-auto">
          {started ? <Youtube url={url} ts={ts} /> : null}
        </div>
      </div>
      {started ? (
        <>
          <Divider summary={summary} url={url} />
          <article className="prose prose-red w-full border-red-100 mx-auto px-3 lg:px-0">
            <ReactMarkdown
              components={{
                a: LinkRenderer,
              }}
            >
              {summary.replace("Overview:", "\n\nOverview:")}
            </ReactMarkdown>
          </article>
          <Divider summary={summary} url={url} />
        </>
      ) : null}
    </>
  );
}
