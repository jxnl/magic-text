import {
  ChatBubbleBottomCenterTextIcon,
  CircleStackIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  FilmIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  {
    name: "Home",
    href: "/",
    desc: "Home where you can find the other pages.",
    icon: HomeIcon,
    hide: true,
  },
  {
    name: "Journal (Beta)",
    href: "https://jrnl.jxnl.co",
    desc: "Conversational life coach which writes your daily journal. It has a long term memory of who you are and its designed to help you achieve your goals and live a better life. Asks you thoughtful questions and helps you reflect on your day.",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: "Youtube",
    href: "/youtube",
    desc: "Get video summary in markdown format, with or without transcript.",
    icon: FilmIcon,
  },
  {
    name: "Data Analyst",
    href: "/data",
    desc: "Ask plain English questions with a SQL Schema and get queries, explanations, and update schemas.",
    icon: CircleStackIcon,
  },
  {
    name: "Text Brushs",
    href: "/text",
    desc: "Instantly customize highlighted text with brush options in real-time.",
    icon: DocumentIcon,
  },
  {
    name: "Tailwind CSS",
    href: "/demo/div",
    desc: "Create HTML divs with natural language, powered by tailwindcss.",
    icon: CodeBracketIcon,
  },
];

export function Support() {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
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
  );
}
