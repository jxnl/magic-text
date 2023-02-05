import "./globals.css";
import Link from "next/link";

function Header() {
  return (
    <div className="text-left my-6">
      Powered by{" "}
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className="flex max-w-2xl mx-auto flex-col items-left py-2 mt-20 p-2">
        <Header />

        <div className="min-h-screen">{children}</div>
        <footer>
          <div>
            <p className="border-t-2 py-2 text-sm max-w-2xl text-gray-500 justify-center">
              Any sufficiently advanced technology is indistinguishable from
              magic. - Arthur C. Clarke
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
