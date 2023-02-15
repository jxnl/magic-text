"use client";

import Link from "next/link";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("Enter a youtube url to get started!");
  const [url, setUrl] = useState("");

  const generateFillin = async (e: any) => {
    e.preventDefault;

    // use regex to check if url is youtube linke
    const regex = new RegExp(
      "^(https?:\\/\\/)?((w){3}.)?youtu(be|.be)?(\\.com)?\\/.+"
    );
    if (!regex.test(url)) {
      toast.error("Please enter a valid youtube url");
      return;
    }

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
      // sometimes chunkValue gets decoded as adate, if that h appens we want to throw it out
      // or if its numeric
      if (
        chunkValue.match(/^[0-9]+$/) ||
        new Date(chunkValue).toString() === "Invalid Date"
      ) {
        _fillText += chunkValue;
        // if there is a single # at the start we add two new lines
        // to make it a header
        setSummary(_fillText.trim());
      } else {
        console.log("Invalid date: " + chunkValue);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
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
        accurate than the transcript and will take longer to generate.
      </p>
      <SyntaxHighlighter
        className="rounded-md"
        language="markdown"
        wrapLongLines={true}
      >
        {summary}
      </SyntaxHighlighter>
      <div className="flex mt-6 space-x-3 mb-5">
        <input
          value={url}
          disabled={loading}
          className="flex-1 rounded-lg text-md border-gray-00  text-gray-900 bg-gray-50 p-2 border-2 disabled:opacity-60"
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <button
          onClick={(e) => generateFillin(e)}
          disabled={loading}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
