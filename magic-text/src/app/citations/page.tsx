"use client";

import {useRef, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {CitationDisplay} from "@/app/citations/components/CitationDisplay";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {Loader2} from "lucide-react";
import Link from "next/link";

const defaultContext =
  "My name is Jason Liu, and I grew up in Toronto Canada but I was born in China.I  went to an arts highschool but in university I studied Computational Mathematics and physics. As part of coop I worked at many companies including Stitchfix, Facebook. I also started the Data Science club at the University of Waterloo and I was the president of the club for 2 years.";
const defaultQuestion = "What did the author do in school?";

type ICitationLocation = [number, number];

type ICitationData = {
  body: string;
  spans: ICitationLocation[];
  citation: string[];
};

export default function Example() {
  const [context, setContext] = useState(defaultContext);
  const inputRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [citations, setCitations] = useState<ICitationData[]>([]);
  const [tab, setTab] = useState("input");

  const [savedContext, setSavedContext] = useState<string>("");

  const generateCitations = (e: any) => {
    e.preventDefault();

    setLoading(true);
    setSavedContext(context);
    setTab("preview");
    setCitations([]);

    return fetch("/api/citations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: inputRef.current!.value,
        context,
      }),
    })
      .then(response => response.body)
      .then(async (stream) => {
        if (!stream) {
          console.error("API does not return stream")
          return
        }
        const decoder = new TextDecoder();
        for await (const chunk of stream) {
          console.log("received", chunk);
          const value = decoder.decode(chunk);
          console.log("decoded", value);
          const parsedCitation: ICitationData = JSON.parse(value);
          setCitations((prev) => Array.from(prev).concat(parsedCitation));
        }
        /*
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        async function read(): Promise<any> {
          const { done, value } = await reader.read();

          if (done) {
            return;
          }
          console.log("received", value);
          const chunk = decoder.decode(value);
          console.log("decoded", chunk);
          const parsedCitation: ICitationData = JSON.parse(chunk);
          setCitations((prev) => Array.from(prev).concat(parsedCitation));
          return read();
        }

        await read();

         */
      })
      .finally(() => {
        setLoading(false);
        toast.success("Try hovering over the statements");
      });
  };

  return (
    <>
      <ToastContainer/>
      <div className="mx-auto max-w-7xl lg:flex lg:gap-8 lg:px-8">
        <div className="px-6 pt-10 pb-10 sm:pb-22 lg:col-span-7 lg:px-0 lg:pt-20 lg:pb-56 xl:col-span-6 flex-1">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="hidden sm:mb-8 sm:flex sm:justify-left">
              <div
                className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Powered by OpenAI Function calls.{" "}
                <Link
                  target="_blank"
                  href="https://wandb.ai/jxnlco/function-calls/reports/Better-Data-Extraction-Using-Pydantic-and-OpenAI-Function-Calls--Vmlldzo0ODU4OTA3"
                  className="font-semibold text-red-600"
                >
                  <span className="absolute inset-0" aria-hidden="true"/>
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Exact citations
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Not only can we use language models to answer question from a
              context we can also use structed extraction to provide character
              level citations that allow us to fact check each statement in the
              context, minimizing halucinations.
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
                  placeholder={defaultQuestion}
                />
              </div>
              <button
                onClick={generateCitations}
                disabled={loading}
                type="button"
                className="rounded-md flex items-center bg-red-600 py-2 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-80"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {loading ? "Generating..." : "Go!"}
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 lg:px-0 w-full h-full flex-1">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="mx-auto max-w-2xl lg:mx-0"
          >
            <TabsList>
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="preview" disabled={!Boolean(savedContext)}>
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              <div className="relative lg:col-span-5 lg:-mr-8 my-auto">
                <label
                  htmlFor="name"
                  className="absolute -top-2 left-2 inline-block px-1 text-xs font-medium text-gray-900"
                >
                  Context
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={20}
                  cols={60}
                  disabled={loading}
                  className="block w-full resize-none border-2 border-b border-transparent pb-2 text-gray-900 placeholder:text-gray-900 bg-gray-100 p-3 rounded-md focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6 font-mono"
                />
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <CitationDisplay context={savedContext} citations={citations}/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
