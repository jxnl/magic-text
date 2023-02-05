import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        Magic by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        Magic is a collection of GPT powered demonstrations to show how easy it
        is to get started integrating the OpenAI API into your own projects. The
        source code for this site is available on Github at{" "}
        <Link
          href="https://www.github.com/jxnl/magic-text"
          className="underline underline-offset-3 hover:text-gray-900"
        >
          jxnl/magic-text
        </Link>
        . My goal is to build in public. I am a ml engineer learning
        react/nextjs and so this is effectively a scratch pad for both learning
        front end and prompt engineering. I want to get my first dozen or so
        {"'low hanging fruit'"} out of the way so the better ideas can come
        through.
      </p>
      <h2 className="sm:text-3xl mb-3 text-md max-w-2xl font-bold text-slate-800 items-center">
        Check out the demos:
      </h2>
      <div className="pl-1 sm:pl-5 text-slate-700">
        <h2 className="sm:text-2xl text-md max-w-2xl font-bold items-center pt-2">
          <Link
            href="demo/text"
            className="underline underline-offset-3 hover:text-gray-900"
          >
            Magic Text:
          </Link>
        </h2>
        <p className=" text-gray-600 pt-1">
          Select some text in the text area to see the brush options and watch
          as Magic rewrites what you ask it to in real time, no need to wait for
          loading spinners.
        </p>
      </div>
      <div className="pl-1 sm:pl-5 text-slate-700">
        <h2 className="sm:text-2xl text-md max-w-2xl font-bold items-center pt-2">
          <Link
            href="demo/sql"
            className="underline underline-offset-3 hover:text-gray-900"
          >
            Magic SQL:
          </Link>
        </h2>
        <p className=" text-gray-600 pt-1">
          Use the default schema or add your own. Ask questions in natural
          language and let Magic SQL do its best to explain the answer and
          suggest data if it doesn{"'"}t know. You can also Magic to add tables
          or columns and the schema will automatically update.
        </p>
      </div>
    </div>
  );
}
