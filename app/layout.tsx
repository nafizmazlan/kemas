import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KEMAS",
  description: "House cleaning tracker with interactive floor plan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}