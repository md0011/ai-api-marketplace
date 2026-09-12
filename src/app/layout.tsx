import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentMarket",
  description: "Autonomous AI service marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}