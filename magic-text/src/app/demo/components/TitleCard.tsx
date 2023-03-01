import Link from "next/link";

export default function TitleCard(props: {
  title: string;
  description: string;
}) {
  const { title, description } = props;
  return (
    <>
      <h1 className="sm:text-6xl text-lg max-w-2xl font-bold text-slate-900 items-center">
        <Link href="/">Magic</Link> {title} by{" "}
        <a
          className="underline-offset-8 underline"
          href="https://jxnl.co/contact"
        >
          Jason
        </a>
      </h1>
      <p className="text-md text-gray-600 my-6">
        {description} If you have any suggestions send me an{" "}
        <a
          className="underline hover:opacity-70"
          href="mailto:jason+magicfeedback@jxnl.co"
        >
          email
        </a>
      </p>
    </>
  );
}
