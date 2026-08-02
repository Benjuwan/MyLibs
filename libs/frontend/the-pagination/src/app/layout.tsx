import type { Metadata } from "next";
import "./globals.css";
import { PagerContextFragment } from "@/providers/PagerContextFragment";

export const metadata: Metadata = {
  title: "Next.js - thePagination",
  description: "Next.jsのシンプルで汎用的なページネーションコンポーネント",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PagerContextFragment>
          {children}
        </PagerContextFragment>
      </body>
    </html>
  );
}
