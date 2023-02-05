"use client";

import Link from "next/link";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { makePrompt } from "./prompt";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState(
    `
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
    product_name VARCHAR(100)`.trim()
  );
  const [sqlQuery, setQuery] = useState("SELECT Count(1) FROM Customers;");
  const [question, setQuestion] = useState(
    "What is the total number of customers?"
  );

  const generateFillin = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const prompt = makePrompt(question, schema, sqlQuery);

    var _fillText = "";

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
    <div>
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        <Link href="/">Magic</Link> SQL by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        Use the default schema or add your own. Ask questions in natural
        language and let Magic SQL do its best to explain the answer and suggest
        data if it doesn{"'"}t know. You can also Magic to add tables or columns
        and the schema will automatically update.
      </p>
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
          value={question}
          disabled={loading}
          className="flex-1 rounded-lg text-md border-gray-00  text-gray-900 bg-gray-50 p-2 border-2 disabled:opacity-60"
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
        />
        <button
          onClick={(e) => generateFillin(e)}
          disabled={loading}
          className="flex-none mr-2 rounded-lg px-4 py-2 text-md  font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
        >
          Ask Magic
        </button>
      </div>
    </div>
  );
}
