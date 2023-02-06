"use client";

import Link from "next/link";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import parse from "html-react-parser";
import { makePrompt, exampleQuestion } from "./prompt";
import { Helmet } from "react-helmet";
import Script from "next/script";

export default function Home(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState(exampleQuestion.trim());
  const [html, setHTML] = useState("<div></div>");
  const [stop, setStop] = useState(false);

  const generateFillin = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const prompt = makePrompt(command, html);

    var _fillText = "";

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
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

    while (!done && !stop) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      _fillText += chunkValue;
      setHTML(_fillText.trim());
    }

    setLoading(false);
    setStop(false);
  };

  return (
    <div>
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        <Link href="/">Magic</Link> Div by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        Magic Div is a tool for generating HTML from a natural language demand.
        It is a work in progress, but you can try it out below.
      </p>

      <SyntaxHighlighter
        wrapLongLines={true}
        language="html"
        className="mt-6 p-6 py-10 rounded-md text-xs"
      >
        {html}
      </SyntaxHighlighter>

      <div className="grid grid-cols-5 gap-3 mt-6">
        <div className="col-span-5 md:col-span-4">
          <textarea
            value={command}
            disabled={loading}
            rows={5}
            className="w-full rounded-lg text-md border-gray-00  text-gray-700 bg-gray-50 p-2 border-2 disabled:opacity-60"
            onChange={(e) => {
              setCommand(e.target.value);
            }}
          />
        </div>
        <div className="col-span-5 md:col-span-1 space-y-2">
          <button
            onClick={(e) => generateFillin(e)}
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 text-md font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
          >
            Ask Magic
          </button>
          <button
            onClick={() => {
              setHTML("<div></div>");
            }}
            className="w-full rounded-lg px-4 py-2 text-md font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
          >
            Clear Html
          </button>
          <button
            onClick={() => {
              setCommand("");
            }}
            className="w-full rounded-lg px-4 py-2 text-md font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
          >
            Clear Text
          </button>
        </div>
      </div>
      <div className="mt-5 rounded-lg p-5 bg-gray-50">{parse(html)}</div>
      <Script src="https://unpkg.com/tailwindcss-jit-cdn"></Script>
    </div>
  );
}
