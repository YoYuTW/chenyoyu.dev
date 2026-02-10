import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
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
  title: {
    default: "YoYu Chen — Problem Solver & Software Engineer",
    template: "%s | YoYu Chen",
  },
  description:
    "Software engineer who solves problems. Specialising in complex front-end applications, React/TypeScript, and full-stack solutions.",
  metadataBase: new URL("https://chenyoyu.dev"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://chenyoyu.dev",
    siteName: "YoYu Chen",
    title: "YoYu Chen — Problem Solver & Software Engineer",
    description:
      "Software engineer who solves problems. Specialising in complex front-end applications, React/TypeScript, and full-stack solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "YoYu Chen — Problem Solver & Software Engineer",
    description:
      "Software engineer who solves problems. Specialising in complex front-end applications, React/TypeScript, and full-stack solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
