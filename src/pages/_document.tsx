import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="ar" dir="rtl">
            <Head />
            <body className="flex flex-col min-h-full bg-customOrange-100">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
