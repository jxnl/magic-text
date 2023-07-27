import "./globals.css";
import { AnalyticsWrapper } from "./demo/components/analytics";
import Header from "./components/Header";
import Footer from "./components/Footer";

const title = "Magic Playground";
const description =
  "Playground for text editing, studying video content, data analysis, and surveying. Powered by natural language processing.";

export const metadata = {
  title,
  description,
  keywords: [
    "Youtube",
    "Large Language Model",
    "GPT-3",
    "Vercel",
    "Next.js",
    "AI Text Editor",
    "AI Data Analyst",
  ],
  colorScheme: "dark",
  creator: "Jason Liu",
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/welcome.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@jxnlco",
    images: ["/welcome.png"],
  },
};

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

      <body className="bg-white">
        <Header />
        {children}
        <Footer />
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
