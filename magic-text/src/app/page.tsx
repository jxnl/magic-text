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
        Magic is a showcase of the AI tools I've been playing with. I've made
        the source code available on Github under{" "}
        <Link
          href="https://www.github.com/jxnl/magic-text"
          className="underline underline-offset-3 hover:text-gray-900"
        >
          jxnl/magic-text
        </Link>
      </p>
      <p className="text-md text-gray-600 my-6">
        I'm using this project as an opportunity to learn and grow as a machine
        learning engineer, by building in public. I'm diving into React/NextJS
        while tackling some low hanging fruit, and I have big plans for what's
        to come. My goal with Magic is to inspire others to explore the
        possibilities of the OpenAI API and to show that with a little
        creativity, the sky's the limit.
      </p>

      <div className="demo-container p-2 pt-4 border-t-2">
        <div className="text-slate-700">
          <h2 className="sm:text-2xl text-md max-w-2xl font-bold items-center pt-2">
            <Link
              href="demo/text"
              className="underline underline-offset-3 hover:text-gray-900"
            >
              Magic Text:
            </Link>
          </h2>
          <p className=" text-gray-600 pt-1">
            Simply highlight any text in the text area, and you'll be able to
            see the brush options in real time. No need to wait for any loading
            spinners, as Magic will immediately begin rewriting your selection
            to your specifications.
          </p>
        </div>
        <div className="text-slate-700">
          <h2 className="sm:text-2xl text-md max-w-2xl font-bold items-center pt-2">
            <Link
              href="demo/sql"
              className="underline underline-offset-3 hover:text-gray-900"
            >
              Magic SQL:
            </Link>
          </h2>
          <p className=" text-gray-600 pt-1">
            Use the default schema or add your own and ask questions in plain
            englihs and let Magic SQL do its best to explain the answer. You can
            also Magic to add tables or columns and the schema will
            automatically update.
          </p>
        </div>
      </div>
    </div>
  );
}
