import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackbox",
  description: "Discover the hidden function through systematic experimentation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
