import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
    const { data: Session, status } = useSession();
    return (
        <header className="border-b min-h-[4rem] shadow shadow-customOrange-900 flex items-center ">
            <nav className="container flex items-center justify-between px-2 mx-auto">
                <Link
                    href="/"
                    className="font-bold sm:text-3xl text-customOrange-900 "
                >
                    〽 Club Sport
                </Link>
                <ul className="flex items-center gap-2 text-sm font-bold">
                    <li>
                        <Link href="/" className="flex gap-2">
                            <span className="hidden sm:inline">🏠</span>
                            <p>الرئيسية</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/queue" className="flex gap-2 sm:p-2">
                            <span className="hidden sm:inline">🏁</span>
                            <p>الانتظار</p>
                        </Link>
                    </li>
                    <li>
                        {status === "authenticated" ? (
                            <Link href="/api/auth/signout?callbackUrl=/">
                                خروج
                            </Link>
                        ) : (
                            <Link href="/auth">الدخول</Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}
