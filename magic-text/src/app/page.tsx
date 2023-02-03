"use client";

import { SyntheticEvent, useState } from "react";
import { PromptType, makePrompt } from "./_prompt";
import { motion, AnimatePresence } from "framer-motion";

const minSelectionLength = 50;

export default function Home() {
  const [textBox, setTextBox] = useState(
    "I am a Data Scientist/Machine Learning Engineer with 8+ years of experience in Python and related Data/ML tools. In the past, I spent my time working with organizations such as Stitchfix, Meta, and NYU Global Institute of Public Health. I happen to a degree in Computational Mathematics & Statistics from the University of Waterloo.\n\nThanks for checking out this demo, please reach out with any questions at jason at jxnl dot co.  \n\nThese days, I've been learning Javascript, this app took me about 8 hours and uses Vercel Edge Functions, Next.js, and OpenAI GPT models. I also like to play the trumpet, freedive, pottery, and jiujitsu so if you're into any of those things, let's connect on twitter @jxnl.co"
  );
  const [warn, setWarn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectStart, setSelectStart] = useState(0);
  const [selectEnd, setSelectEnd] = useState(0);

  const generateFillin = async (e: any, promptType: PromptType) => {
    e.preventDefault();

    const prefix = textBox.substring(0, selectStart);
    const suffix = textBox.substring(selectEnd, textBox.length);
    const selectedText = textBox.substring(selectStart, selectEnd);

    // after the button click, the selection is reset so multiple
    // clicks can be made without having to reselect the text
    var _fillText = "";
    var _textBox = textBox;
    setSelectStart(0);
    setSelectEnd(0);
    setLoading(true);

    const prompt = makePrompt({
      promptType: promptType,
      text: selectedText,
    });

    console.log(`Sending request to Edge function... ${prompt}`);

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
      _textBox = prefix + _fillText + suffix;
      setTextBox(_textBox.trim());
    }
    setLoading(false);
    setSelectStart(0);
    setSelectEnd(0);
  };

  // @ts-nocheck
  async function onSelection(
    event: SyntheticEvent<HTMLTextAreaElement, Event>
  ) {
    // used to determine if we should show the menu
    // and if the selection is long enough and warn the user
    const target = event.target as HTMLInputElement;

    const selection = target.value.substring(
      target.selectionStart || 0,
      target.selectionEnd || 0
    );
    // cannot be accessed until the button click
    // for some reason its not updating the state in this scope
    setSelectStart(target.selectionStart || 0);
    setSelectEnd(target.selectionEnd || 0);

    if (selection) {
      if (selection.toString().length < minSelectionLength) {
        setWarn(true);
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
        setWarn(false);
      }
    } else {
      setWarn(false);
      setMenuOpen(false);
    }
  }

  return (
    <div className="flex max-w-2xl mx-auto flex-col items-left py-2 mt-20 min-h-screen">
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        Magic Text by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-4">
        Select some text first to check out the magic, then apply a brush.
      </p>
      <textarea
        value={textBox}
        onChange={(e) => setTextBox(e.target.value)}
        onSelect={(e) => onSelection(e)}
        rows={10}
        cols={50}
        disabled={loading}
        className="w-full rounded-md text-sm border-gray-100 bg-gray-50 shadow-md p-6 border-2 disabled:opacity-60"
      />
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className=" bg-gray-50 shadow-lg rounded-md p-6 my-4 max-w-none border-2 border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="group"
          >
            <h2 className="text-sm font-medium mb-1">Text Brushes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Apply any brush to the text you&apos;ve selected to use text magic
              to improve your writing instantly.
            </p>
            <div>
              {Object.keys(PromptType).map((promptType, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="mr-2 rounded-lg px-4 py-2 text-sm shadow-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 disabled:opacity-60"
                  onClick={(e) => {
                    generateFillin(
                      e,
                      PromptType[promptType as keyof typeof PromptType]
                    );
                  }}
                >
                  {promptType}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {warn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-6 my-4"
            role="alert"
          >
            <p className="font-bold">Selection too short</p>
            <p>
              In order for magic text to work well we will need more than{" "}
              {minSelectionLength}&nbsp; characters selected.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
