import {
  ChatBubbleBottomCenterTextIcon,
  CircleStackIcon,
  CodeBracketIcon,
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
