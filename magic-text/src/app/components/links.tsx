import {
  ChatBubbleLeftRightIcon,
  CircleStackIcon,
  CodeBracketIcon,
  DocumentIcon,
  FilmIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export const navigation = [
  {
    name: "Text Editor",
    href: "/demo/text",
    desc: "Instantly customize highlighted text with brush options in real-time.",
    icon: DocumentIcon,
  },
  {
    name: "Youtube",
    href: "/youtube",
    desc: "Get video summary in markdown format, with or without transcript.",
    icon: FilmIcon,
  },
  {
    name: "Data Analyst",
    href: "/demo/sql",
    desc: "Ask plain English questions, get explanations, and update schemas.",
    icon: CircleStackIcon,
  },
  {
    name: "Tailwind CSS",
    href: "/demo/div",
    desc: "Create HTML divs with natural language, powered by tailwindcss.",
    icon: CodeBracketIcon,
  },
  {
    name: "Survey",
    href: "/demo/survey",
    desc: "Conversational agent helps users complete surveys and store data.",
    icon: ChatBubbleLeftRightIcon,
  },
];
