import type { Metadata } from "next";
import "./globals.css";
import { PagerContextFlagment } from "@/providers/PagerContextFragment";

export const metadata: Metadata = {
  title: "thePagination",
  description: "ページネーションコンポーネントのサンプルページ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PagerContextFlagment>
          {children}
        </PagerContextFlagment>
      </body>
    </html>
  );
}
