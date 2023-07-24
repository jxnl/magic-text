const title = "Data Analysis";
const description =
  "Magic Data Analysis is a tool for extracting knowledge from data by asking questions.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@jxnlco",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="py-24 sm:py-32 m-auto">{children}</div>;
}
