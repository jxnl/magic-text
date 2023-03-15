"use client";

import { useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { makePrompt } from "./prompt";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Divider from "./components/Divider";

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

export default function Example() {
  const [schema, setSchema] = useState(sampleSchema);
  const [query, setQuery] = useState("SELECT * FROM Customers;");
  const inputRef = useRef<any>();
  const [loading, setLoading] = useState(false);

  const generateFillin = async (e: any) => {
    e.preventDefault();

    const prompt = makePrompt(inputRef.current!.value, schema, query);

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

    if (_fillText.includes("ALTER TABLE")) {
      setSchema(schema + "\n\n" + _fillText);
    }

    if (_fillText.includes("CREATE TABLE")) {
      setSchema(schema + "\n\n" + _fillText);
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pt-10 pb-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-20 lg:pb-56 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Magic Data
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Magic Data is a tool that helps you understand your data, bring
              your own schema and data, and get insights from your data. You can
              also ask it to create new tables and migrations and we{"'"}ll
              append it to the schema
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  id="question"
                  ref={inputRef}
                  size={60}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6 lg:text-base"
                  placeholder="What is the average age of our customers?"
                />
              </div>
              <button
                onClick={generateFillin}
                disabled={loading}
                type="button"
                className="rounded-md bg-red-600 py-2 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-80"
              >
                Go!
              </button>
            </div>
            <SyntaxHighlighter
              wrapLongLines={true}
              language="sql"
              className="block mt-5 min-h-full w-full resize-none border-2 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-900 bg-gray-100 p-3 rounded-md focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
            >
              {query}
            </SyntaxHighlighter>
          </div>
        </div>
        <div className="lg:hidden">
          <Divider schema={schema} query={query} />
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 my-auto">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-gray-900"
          >
            Bring your own schema
          </label>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            rows={20}
            cols={60}
            disabled={loading}
            className="block w-full resize-none border-2 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-900 bg-gray-100 p-3 rounded-md focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
          />
          <Divider schema={schema} query={query} />
        </div>
      </div>
    </>
  );
}
