const title = "Citations";
const description =
  "Magic Citations not only answer questions based on context but will also show you eactly where its coming from!";

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
