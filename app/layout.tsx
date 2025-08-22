import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpotMijnVlucht",
  description: "Find the best flight deals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}
