import "./globals.css";
import { AnalyticsWrapper } from "./demo/components/analytics";
import Header from "./components/Header";
import Footer from "./components/Footer";

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

      <body className="flex max-w-3xl mx-auto flex-col items-left py-2 p-2">
        <Header />

        <main className="min-h-screen">{children}</main>
        <AnalyticsWrapper />
        <Footer />
      </body>
    </html>
  );
}
