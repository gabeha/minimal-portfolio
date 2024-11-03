import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gabriel Hauss",
  description: "Gabriel Hauss' personal website",
  icons:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👋🏼</text></svg>",
};

const eb_garamond = EB_Garamond({
  subsets: ["latin"],
});

const links = [
  {
    href: "/photos",
    label: "Photography",
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
        className={`${eb_garamond.className} antialiased bg-orange-50 min-h-screen`}
      >
        <div className="h-full flex flex-col p-4 space-y-2 max-w-2xl mx-auto">
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
        <footer className="w-full mex-auto flex justify-center items-center gap-4 py-4">
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
