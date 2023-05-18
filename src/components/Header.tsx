import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { userAgent } from "next/server";
import { Fragment } from "react";
import { TbDots } from "react-icons/tb";
import { Role } from "types";

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
                            <span>🏠</span>
                            <p className="hidden sm:inline">الرئيسية</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/queue" className="flex gap-2 sm:p-2">
                            <span>🏁</span>
                            <p className="hidden sm:inline">الانتظار</p>
                        </Link>
                    </li>
                    <li className="self-end">
                        <Menu
                            as="div"
                            className="relative inline-block text-left"
                        >
                            <div>
                                <Menu.Button className="mt-2 text-black hover:text-customOrange-900">
                                    <TbDots className="text-2xl" />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 min-w-[4rem] mt-2 origin-top-left bg-white divide-y rounded-md shadow-lg divide-customGray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {status === "authenticated" ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/api/auth/signout?callbackUrl=/"
                                                    className={`${
                                                        active
                                                            ? "bg-customOrange-100 text-customOrange-900"
                                                            : "text-gray-900"
                                                    } group flex w-full items-center px-2 py-2 text-sm justify-center `}
                                                >
                                                    خروج
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ) : null}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={
                                                    status === "authenticated"
                                                        ? Session.user.role ===
                                                              Role.OWNER ||
                                                          Session.user.role ===
                                                              Role.ADMIN
                                                            ? "/auth?tab=signup"
                                                            : "."
                                                        : "/auth?tab=login"
                                                }
                                                className={`${
                                                    active
                                                        ? "bg-customOrange-100 text-customOrange-900"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm justify-center`}
                                            >
                                                جديد
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
