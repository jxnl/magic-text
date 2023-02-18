import Link from "next/link";

export default function Header() {
  return (
    <div className="text-left my-6">
      <Link
        href="/"
        className="font-bold hover:underline transition underline-offset-2"
      >
        Magic
      </Link>{" "}
      powered by{" "}
      <a
        href="https://openai.com/"
        target="_blank"
        rel="noreferrer"
        className="font-bold hover:underline transition underline-offset-2"
      >
        OpenAI
      </a>{" "}
      and{" "}
      <a
        href="https://vercel.com/"
        target="_blank"
        rel="noreferrer"
        className="font-bold hover:underline transition underline-offset-2"
      >
        Vercel
      </a>
      . Find me on{" "}
      <Link
        href="https://twitter.com/jxnlco"
        className="font-bold hover:underline transition underline-offset-2"
      >
        Twitter
      </Link>{" "}
      and{" "}
      <Link
        href="https://github.com/jxnl/magic-text"
        className="font-bold hover:underline transition underline-offset-2"
        aria-label="Jason on GitHub"
      >
        Github
      </Link>
      .
    </div>
  );
}
