import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from './Header'
import { Footer } from './Footer'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] }) // デフォルトフォント

/**
 * <body className={inter.className}> // デフォルトクラス
*/

export const metadata: Metadata = {
  title: 'Udemy Next 13 Blog',
  description: 'Udemy Next 13 Blog Course',
  robots: {
    index: false, // noindex
    follow: false // nofollow
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="container mx-auto bg-slate-700 text-slate-50">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {/* flex-grow で main 要素を（無駄な余白が生まれないように）伸長させる */}
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
