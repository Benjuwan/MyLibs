/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export', // 静的エクスポートを有効：Next.js はアプリケーションの HTML/CSS/JS アセットを含むフォルダーを作成する（当然だが動的フォルダやファイルがあると静的ビルドは成功しない）

    // nextConfig によって、対象サイト（今回は unsplash ）からの画像データ取得許可を与える
    images: {
        'remotePatterns': [
            {
                protocol: 'https',
                hostname: 'source.unsplash.com'
            }
        ],
    }
}

module.exports = nextConfig
