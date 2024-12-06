import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gabriel Hauss",
  description: "Gabriel Hauss' personal website",
};

const eb_garamond = EB_Garamond({
  subsets: ["latin"],
});

const links = [
  {
    href: "/videos",
    label: "Videos",
  },
  {
    href: "/photos",
    label: "Photos",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${eb_garamond.className} antialiased bg-orange-50 min-h-screen flex flex-col justify-between`}
      >
        <div className="flex-grow h-full flex flex-col p-4 space-y-2 max-w-2xl mx-auto w-full">
          {/* Header */}
          <header className="h-full flex justify-between w-full items-end">
            <Link href="/">
              <h1 className="text-3xl tracking-widest">Gabriel Hauss</h1>
            </Link>
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:underline"
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </header>
          <Separator className="bg-black" />
          <main className="flex-grow h-full w-full mx-auto flex flex-col items-center justify-start">
            {children}
          </main>
        </div>
        <footer className="w-full mx-auto flex justify-center items-center gap-4 py-4">
          <a href="https://github.com/gabeha" target="_blank">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/gabriel-hauss/" target="_blank">
            LinkedIn
          </a>
          <a href="https://www.youtube.com/@Etb1999" target="_blank">
            Youtube
          </a>
          <a href="/gabriel-hauss-cv-november-2024.pdf" target="_blank">
            Curriculum Vitae
          </a>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
