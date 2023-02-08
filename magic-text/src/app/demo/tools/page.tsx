"use client";

import Link from "next/link";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import parse from "html-react-parser";
import { makePrompt } from "./prompt";

import Script from "next/script";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [command, setCommand] = useState("what is the capital of france?");
  const [history, setHistory] = useState("");
  const [stop, setStop] = useState(false);

  const generateFillin = async (e: any, command: string, history: string) => {
    e.preventDefault();

    setLoading(true);

    const prompt = makePrompt(command, history);

    var _history = history;
    var _response = "";

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        stop: ["Result:"],
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
      _response += chunkValue;
      setHistory(history.trim() + "\n" + _response.trim());
    }

    // this was written in a hurry, so it's not very clean
    if (_response.includes("Action:")) {
      const regex = /Action: (\w+)\s+Action Input: (.+)/;
      const match = _response.match(regex);
      const action = match![1];
      const actionInput = match![2];

      if (action === "WIKIPEDIA") {
        const actionResult = await fetch("/api/tool/wiki", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search: actionInput,
          }),
        }).then((res) => res.json());
        const new_history = `${_history.trim()}\n${_response.trim()}\nResult: ${
          actionResult.result
        }`;
        setHistory(new_history);
        generateFillin(e, command, new_history);
      }
    }

    setLoading(false);
    setStop(false);
  };

  return (
    <div>
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        <Link href="/">Magic</Link> Tools by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        Magic Tools is an agent which has the ability to use tools to solve
        problems. It can use tools like a calculator or wikipedia.
      </p>

      <SyntaxHighlighter
        wrapLongLines={true}
        language="text"
        className="mt-6 p-6 py-10 rounded-md text-xs"
      >
        {history}
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
            onClick={(e) => {
              setHistory("");
              generateFillin(e, command, "");
            }}
            disabled={loading}
            className="w-full rounded-lg px-4 py-2 text-md font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
          >
            Ask Magic
          </button>
          <button
            onClick={() => {
              setHistory("");
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
    </div>
  );
}
