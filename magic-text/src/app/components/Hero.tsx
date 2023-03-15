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
            OpenAI{" "}
          </Link>
          and{" "}
          <Link
            href="https://vercel.com"
            className="font-bold text-blue-600"
            target={"_blank"}
          >
            Vercel.{" "}
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
        </div>
      </div>
    </div>
  );
}
