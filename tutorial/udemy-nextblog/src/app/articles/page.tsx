import Link from "next/link";

const page = () => {
    const benjuwan_WrapperStyle: object = {
        'margin': '16em auto',
        'textAlign': 'center'
    }

    const benjuwan_defaultAnkerStyle: object = {
        "color": "skyblue",
        "textDecoration": "underLine"
    }

    return (
        <div style={benjuwan_WrapperStyle}>
            <h2>here is articles Page.tsx</h2>
            <p>page.tsx のコンポーネント名の先頭は大文字でなくても機能する。</p>
            <p>React でいうところの main.tsx のようなもの。</p>
            <Link href="/" style={benjuwan_defaultAnkerStyle}>to TOP</Link>
        </div>
    );
}

export default page;