"use client";

import { SyntheticEvent, useState } from "react";
import { PromptType, makePrompt } from "./prompt";
import { BrushMenu, Warning, minSelectionLength } from "./components";

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

    // if the selection is too short, warn the user
    if (selectedText.length < minSelectionLength) {
      setWarn(true);
      return;
    }

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

    if (prompt.length < minSelectionLength) {
      console.warn("Prompt is too short. Returning text.");
      setWarn(true);
      return;
    }

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
    setMenuOpen(false);
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
    <>
      <div className="mx-auto max-w-7xl lg:gap-x-8 lg:px-8 lg:max-w-6xl">
        <div className="mx-auto w-full py-3 lg:w-3/5">
          <div className="px-6 pt-10 pb-24 sm:pb-10  lg:px-0 lg:pt-20 lg:pb-10 6">
            <h1 className="mt-12 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Magic Text Brushes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Bringing together the worlds of video content and note-taking,
              Magic YouTube is the ultimate tool for extracting knowledge from
              online resources.
            </p>
          </div>

          <textarea
            value={textBox}
            onChange={(e) => setTextBox(e.target.value)}
            onSelect={(e) => onSelection(e)}
            rows={10}
            cols={40}
            disabled={loading}
            className="w-full  text-black rounded-md text-sm border-gray-100 bg-gray-50 shadow-md p-3 border-2 disabled:opacity-60"
          />
          <BrushMenu
            isLoading={loading}
            onClick={generateFillin}
            isOpen={menuOpen}
          />
          <Warning isWarn={warn} />
        </div>
      </div>
    </>
  );
}
