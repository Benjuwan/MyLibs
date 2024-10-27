import Link from "next/link";

export const Header = () => {
    return (
        <header className="py-5 px-10 border-b flex justify-between items-center">
            <h1 className="text-2xl font-extrabold"><Link href='/'>Udemy Next.js13 Blog</Link></h1>
            <nav className="text-sm font-medium">
                <Link className="bg-orange-300 py-3 px-3 rounded-sm" href="/articles/new">記事を書く</Link>
            </nav>
            <p hidden>root（app ディレクトリのlayout.tsx）なので、全コンポーネント・ページ共有の header 要素</p>
        </header>
    );
}

// export default Header