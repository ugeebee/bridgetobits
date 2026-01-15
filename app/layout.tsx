import "./globals.css";
import "./fonts.css";
import "./modern-bold-font.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SessionProviders from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Bridge To BITS",
  description: "Bridge to BITS",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  icons: {
      icon: "/logos/tab_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const black = "#111";
  const white = "#fff";
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: black, color: white }}>
        <SessionProviders>
          <Navbar />
          <main className="flex-1 relative">{children}</main>
          <Footer />
        </SessionProviders>
      </body>
    </html>
  );
}
