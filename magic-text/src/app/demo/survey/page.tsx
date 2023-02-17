"use client";

import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import TitleCard from "../components/TitleCard";
import { makePrompt, exampleSchema } from "./prompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState(exampleSchema);
  const [profile, setProfile] = useState({});
  const [reply, setReply] = useState("Lets get started!");
  const [history, setHistory] = useState("");

  const generateFillin = async (e: any) => {
    e.preventDefault;

    if (reply === "") {
      return;
    }

    const _history = history + "\nUser: " + reply;
    setHistory(_history);

    const prompt = makePrompt(
      JSON.stringify(schema),
      JSON.stringify(profile),
      _history
    );

    console.log("Prompt: " + prompt);

    var _fillText = "";

    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        stop: ["User:"],
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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      _fillText += chunkValue;
      setHistory(_history + "\n" + _fillText.trim());
    }

    // use reges to extract the set comments like `SET property <value>`
    var _profile = profile as { [x: string]: any };
    const setRegex = /SET\s+([a-zA-Z0-9._-]+)\s+(.*)/g;
    const setMatches = _fillText.matchAll(setRegex);
    for (const match of setMatches as any) {
      const key = match[1];
      const value = match[2] as string;
      _profile[key] = value;
      console.log("setting profile:", _profile);
      setProfile(_profile);
    }

    setLoading(false);
  };

  return (
    <>
      <TitleCard
        title="Survey"
        description="Input a json schema and the magic will fill in the data by asking
        questions and setting values using the SET command. This set command
        manipulates the a json object in memory called `profile` feel free to
        inspect and log this object. One can imagine this form of thinking and
        action can be used to build a chatbot or other conversational AI that
        can change the state of the browser session in more complex ways."
      />

      <textarea
        value={JSON.stringify(schema, null, 2)}
        onChange={(e) => {
          setSchema(JSON.parse(e.target.value));
        }}
        rows={10}
        cols={50}
        disabled={loading}
        className="font-mono w-full rounded-md text-xs border-gray-100 bg-gray-50 shadow-md p-6 border-2 disabled:opacity-60"
      />
      <SyntaxHighlighter
        wrapLongLines={true}
        language="txt"
        className="mt-6 p-6 rounded-md"
      >
        {history.trim()}
      </SyntaxHighlighter>
      <div className="flex mt-6 space-x-3">
        <input
          value={reply}
          disabled={loading}
          className="flex-1 rounded-lg text-md border-gray-00  text-gray-900 bg-gray-50 p-2 border-2 disabled:opacity-60"
          onChange={(e) => {
            setReply(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            generateFillin(e);
            setReply("");
          }}
          disabled={loading}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Reply
        </button>
      </div>
      <SyntaxHighlighter
        wrapLongLines={true}
        language="json"
        className="mt-6 p-6 rounded-md"
      >
        {JSON.stringify(profile, null, 2)}
      </SyntaxHighlighter>
    </>
  );
}
