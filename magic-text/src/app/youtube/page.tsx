"use client";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import ReactMarkdown from "react-markdown";

import "react-toastify/dist/ReactToastify.css";

import Divider from "./components/Divider";
import Youtube from "./components/Youtube";
import {
  cachedSummary,
  isValidYoutubeUrl,
  parseChaptersFromSummary,
} from "./utils";
import Link from "next/link";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { Support } from "../components/links";
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
        className="no-underline hover:opacity-80 cursor-pointer hover:underline"
        title={`Jump to ${_ts}s`}
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
      setSummary((prev) => prev + chunkValue);
    }

    toast.success("Summary completed!");
    setLoading(false);
    console.log("Summary completed!", summary);
  };

  const generateShorten = async (e: any) => {
    e.preventDefault;
    setLoading(true);

    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: summary,
      }),
    });
    console.log("Edge function returned.");
    console.log(response);

    if (!response.ok) {
      toast.error("Error shorttening summary.");
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

    setSummary("");

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setSummary((prev) => prev + chunkValue);
    }

    toast.success("Summary shorten completed!");
    setLoading(false);
    console.log("Summary shortten completed!", summary);
  };

  // I believe this is the same as componentDidMount
  // if there is a videoId in the url, set the url to the videoId
  // and check if there is a cached summary, if so, set the summary
  // @ts-ignore
  const videoId = useSearchParams().get("v");
  useEffect(() => {
    if (videoId) {
      setUrl("https://www.youtube.com/watch?v=" + videoId);
      // @ts-ignore
      urlRef.current.value = "https://www.youtube.com/watch?v=" + videoId;
      setStart(true);
      setLoading(true);
      cachedSummary(videoId).then((res) => {
        const { summary_markdown } = res;
        if (summary_markdown) {
          toast.info("Cached summary found!");
          setSummary(summary_markdown);
        } else {
          toast.info("No cached summary found.");
        }
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-20 lg:pb-56 xl:col-span-6">
          <div className="hidden sm:mb-8 sm:flex sm:justify-left">
            <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Check out the chrome extension.{" "}
              <a
                href="https://github.com/jxnl/youtube-summary-chrome"
                className="font-semibold text-red-600"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                GitHub <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="max-w-2xl lg:mx-0">
            <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Youtube University
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Bringing together the worlds of video content and note-taking,
              Magic YouTube is the ultimate tool for extracting knowledge from
              online resources. If you have any feedback hit me up on{" "}
              <Link
                href="https://twitter.com/jxnlco"
                className="text-red-500 font-bold hover:underline"
              >
                Twitter.
              </Link>{" "}
              <br />
              Transcriptions can get costly for long videos without subtitles,
              please consider donating.{" "}
              <Link
                href="https://www.buymeacoffee.com/jxnl"
                className="text-red-500 font-bold hover:underline"
                target={"_blank"}
              >
                Buy me a coffee.
              </Link>
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

      {started && summary && summary.length > 0 ? (
        <>
          <Divider summary={summary} url={url} shortenFn={generateShorten} />
          <Support />
          <article className="prose prose-red w-full border-red-100 mx-auto px-3 lg:px-0">
            <ReactMarkdown
              components={{
                a: LinkRenderer,
              }}
            >
              {"> Heres a tip! Click the # to jump to the timestamp.\n" +
                summary +
                `\n------\n### Sharing Youtube Chapters\nPaste this into the description or comments to add timestamps to any video!. \n\n` +
                "```\n" +
                parseChaptersFromSummary(summary) +
                `\nPowered by Youtube University https://magic.jxnl.co/youtube?v=${videoId}\n` +
                "```"}
            </ReactMarkdown>
          </article>
          <Divider summary={summary} url={url} shortenFn={generateShorten} />
          <Support />
        </>
      ) : null}
    </>
  );
}
