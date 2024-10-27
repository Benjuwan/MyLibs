import type { Metadata } from 'next'

const benjuwan_headerFooterStyle: object = {
  'textAlign': 'center'
}

export const metadata: Metadata = {
  title: 'Artcles Page',
  description: 'here is Articles Page.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>

        <header className='commonHeader' style={benjuwan_headerFooterStyle}>hoge</header>

        {children}

        <footer className='commonFooter' style={benjuwan_headerFooterStyle}>foo</footer>

      </body>
    </html>
  )
}
