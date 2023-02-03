"use client";

import { SyntheticEvent, useState } from "react";
import { PromptType } from "./_prompt";
import { motion, AnimatePresence } from "framer-motion";

const minSelectionLength = 50;

export default function Home() {
  const [textBox, setTextBox] = useState(
    "I am a Data Scientist/Machine Learning Engineer with 8+ years of experience in Python and related Data/ML tools. I spend those years working with organizations such as Stitchfix, Meta, and NYU Global Institute of Public Health. I happen to a degree in Computational Mathematics & Statistics from the University of Waterloo.\nThanks for visiting, please reach out with any questions at jason at jxnl dot co.  \n\nNowadays I am just spending my time playing the trumpet, freediving, doing pottery, and jiujitsu."
  );
  const [warn, setWarn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // @ts-nocheck
  async function onSelection(
    event: SyntheticEvent<HTMLTextAreaElement, Event>
  ) {
    const target = event.target as HTMLInputElement;

    const selection = target.value.substring(
      target.selectionStart || 0,
      target.selectionEnd || 0
    );

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

  async function updateSelection(promptType: PromptType) {
    console.log(`promptType: ${promptType}`);
    // sleep for 1 second to simulate loading
    await new Promise((r) => setTimeout(r, 1000));
  }

  return (
    <div className="flex max-w-2xl mx-auto flex-col items-left py-2 mt-20 min-h-screen">
      <h1 className="sm:text-6xl text-4xl max-w-2xl font-bold text-slate-900 items-center">
        Demonstrating a text editor with Text Magic
      </h1>
      <textarea
        value={textBox}
        onChange={(e) => setTextBox(e.target.value)}
        onSelect={(e) => onSelection(e)}
        rows={10}
        cols={50}
        className="w-full rounded-md border-gray-100 bg-gray-50 shadow-md  my-5 p-3 border-2"
        placeholder={
          "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
        }
      />
      <AnimatePresence>
        {warn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 my-4"
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="inline-flex  divide-gray-200 first:rounded-l-lg last:rounded-r-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="group"
          >
            {Object.keys(PromptType).map((promptType, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm shadow-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200"
                onClick={() => {
                  updateSelection(
                    PromptType[promptType as keyof typeof PromptType]
                  );
                }}
              >
                {promptType}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
