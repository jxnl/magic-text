"use client";

import { useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import TitleCard from "../components/TitleCard";
import { makePrompt } from "./prompt";

const sampleSchema = `
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    created_at DATE
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_total DECIMAL(10,2),
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100)`.trim();

const sampleQuery = `SELECT Count(1) FROM Customers;`;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState(sampleSchema);
  const [sqlQuery, setQuery] = useState(sampleQuery);
  const questionRef = useRef<any>();

  const generateFillin = async (e: any) => {
    e.preventDefault();

    const prompt = makePrompt(questionRef.current!.value, schema, sqlQuery);

    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
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
      setQuery(_fillText.trim());
    }

    if (_fillText.startsWith("ALTER TABLE")) {
      setSchema(schema + "\n\n" + _fillText);
    }

    if (_fillText.startsWith("CREATE TABLE")) {
      setSchema(schema + "\n\n" + _fillText);
    }

    setLoading(false);
  };

  return (
    <>
      <TitleCard
        title="SQL"
        description="Input a json schema and the magic will fill in the data by asking
        questions and setting values using the SET command. This set command
        manipulates the a json object in memory called `profile` feel free to
        inspect and log this object. One can imagine this form of thinking and
        action can be used to build a chatbot or other conversational AI that
        can change the state of the browser session in more complex ways."
      />

      <textarea
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        rows={10}
        cols={50}
        disabled={loading}
        className="font-mono w-full rounded-md text-xs border-gray-100 bg-gray-50 shadow-md p-6 border-2 disabled:opacity-60"
      />

      <SyntaxHighlighter
        wrapLongLines={true}
        language="sql"
        className="mt-6 p-6 rounded-md"
      >
        {sqlQuery}
      </SyntaxHighlighter>

      <div className="flex mt-6 space-x-3">
        <input
          type="text"
          ref={questionRef}
          placeholder="how many customers do we have?"
          disabled={loading}
          className="flex-1 rounded-lg text-md border-gray-00  text-gray-900 bg-gray-50 p-2 border-2 disabled:opacity-60"
        />
        <button
          onClick={(e) => generateFillin(e)}
          disabled={loading}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Ask Magic
        </button>
      </div>
    </>
  );
}
