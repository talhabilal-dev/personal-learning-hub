import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { VideoProvider } from "@/contexts/video-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Learning Hub",
  description: "Organize, track, and learn from your own video collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <VideoProvider>{children}</VideoProvider>
      </body>
    </html>
  );
}
