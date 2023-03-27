import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Powered by{" "}
          <Link
            href="https://openai.com"
            className="font-bold text-blue-600"
            target={"_blank"}
          >
            OpenAI
          </Link>
          ,
          <Link
            href="https://vercel.com"
            className="font-bold text-blue-600"
            target={"_blank"}
          >
            Vercel
          </Link>
          , and{" "}
          <Link
            href="https://modal.com/"
            className="font-bold text-blue-600"
            target={"_blank"}
          >
            Modal
          </Link>
        </div>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to my Magic Playground.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {
            "I'm a machine learning engineer and I love to play with large language models. I've built this site to make it easy for you to play with them too. My background is computational mathematics but I decided to dedicate some time to learning React and Next.js."
          }
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#links"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Get started
          </a>
          <a
            href="https://www.github.com/jxnl/magic-text"
            target={"_blank"}
            rel={"noreferrer"}
            className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-grey-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 inline mr-1"
              aria-hidden={true}
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Star on Github
          </a>
          <a
            href="https://www.buymeacoffee.com/jxnl"
            target={"_blank"}
            rel={"noreferrer"}
            className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <CurrencyDollarIcon className="w-5 h-5 inline mr-1" />
            Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  );
}
