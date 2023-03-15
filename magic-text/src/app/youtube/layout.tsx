const title = "Youtube";
const description =
  "Bringing together the worlds of video content and note-taking, Magic YouTube is the ultimate tool for extracting knowledge from online resources.";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/youtube.png",
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
    title,
    description,
    creator: "@jxnlco",
    images: ["https://magic.jxnl.co/youtube.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="py-24 sm:py-32 m-auto">{children}</div>;
}
