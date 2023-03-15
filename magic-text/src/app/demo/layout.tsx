import Notification from "./components/Notification";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl py-24 sm:py-32 m-auto text-black">
      <Notification />
      {children}
    </div>
  );
}
