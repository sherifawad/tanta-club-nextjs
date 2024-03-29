import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { promises as fs } from "fs";
import path from "path";
import type { Session } from "next-auth";
import Header from "@/components/Header";
import { tmpdir } from "os";

// fs.cp(path.join(process.cwd(), "data"), path.join(tmpdir()));

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={session}>
            <Header />
            <Component {...pageProps} />
        </SessionProvider>
    );
}
