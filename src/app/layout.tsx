import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppLayout from "./AppWrapper";
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
  title: "Sendacoin",
  description: "Sendacoin is a platform for accepting payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-[#f3eee3] `}
      >
        <AppLayout>
          {/* <div className="mx-auto max-w-screen-xl px-1 md:px-4 sm:px-6 relative"> */}
          {children}
          {/* </div> */}
        </AppLayout>
      </body>
    </html>
  );
}
