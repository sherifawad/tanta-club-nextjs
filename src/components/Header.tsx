import { getBaseUrl } from "@/lib/utils";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, SyntheticEvent, useState } from "react";
import { TbDots } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";

const Header = () => {
    const { data: Session, status } = useSession();
    const [openModel, setOpenModel] = useState(false);
    return (
        <header className=" min-h-[4rem] shadow shadow-customOrange-900 flex items-center ">
            <ToastContainer />
            <POPUPPassword
                Session={Session}
                status={status}
                isOpen={openModel}
                closeModal={() => setOpenModel(false)}
            />
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
                                    {status === "authenticated" &&
                                    (Session.user.role === Role.OWNER ||
                                        Session.user.role === Role.ADMIN ||
                                        Session.user.role ===
                                            Role.DASHBOARD) ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard"
                                                    className={`${
                                                        active
                                                            ? "bg-customOrange-100 text-customOrange-900"
                                                            : "text-gray-900"
                                                    } group flex w-full items-center px-2 py-2 text-sm justify-center `}
                                                >
                                                    تقارير
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ) : null}
                                    {status === "authenticated" ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() =>
                                                        setOpenModel(true)
                                                    }
                                                    className={`${
                                                        active
                                                            ? "bg-customOrange-100 text-customOrange-900"
                                                            : "text-gray-900"
                                                    } group flex w-full items-center px-2 py-2 text-sm justify-center `}
                                                >
                                                    نغيير{" "}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ) : null}
                                    {status !== "authenticated" ||
                                    (status === "authenticated" &&
                                        (Session.user.role === Role.OWNER ||
                                            Session.user.role ===
                                                Role.ADMIN)) ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={
                                                        status ===
                                                        "authenticated"
                                                            ? Session.user
                                                                  .role ===
                                                                  Role.OWNER ||
                                                              Session.user
                                                                  .role ===
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
                                                    {status === "authenticated"
                                                        ? "جديد"
                                                        : "دخول"}
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ) : null}
                                    {status === "authenticated" &&
                                    (Session.user.role === Role.OWNER ||
                                        Session.user.role === Role.ADMIN) ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/edit"
                                                    className={`${
                                                        active
                                                            ? "bg-customOrange-100 text-customOrange-900"
                                                            : "text-gray-900"
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm justify-center`}
                                                >
                                                    بيانات
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ) : null}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

type POPUPQueueProps = {
    closeModal: () => void;
    isOpen: boolean;
    Session: Session | null;
    status: "authenticated" | "loading" | "unauthenticated";
};

function POPUPPassword({
    closeModal,
    isOpen,
    Session,
    status,
}: POPUPQueueProps) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const handleSubmitPasswordChange = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (pending) return;
            if (status !== "authenticated") return;
            setPending(true);
            const target = e.target as typeof e.target & {
                oldPassword: { value: string };
                newPassword: { value: string };
            };
            const oldPassword = target.oldPassword.value; // typechecks!
            const newPassword = target.newPassword.value; // typechecks!
            if (
                !oldPassword ||
                oldPassword.length < 5 ||
                !newPassword ||
                newPassword.length < 5
            ) {
                setError(" الرقم السري قصير يجب أم يزيد عن 5");
                return;
            }

            const res = await fetch(`${getBaseUrl()}/api/signup`, {
                method: "PATCH",
                body: JSON.stringify({
                    id: Session?.user.id,
                    oldPassword,
                    newPassword,
                }),
                credentials: "include",
            });
            const message = await res.json();
            if (res.status === 200) {
                setError("");
                closeModal();
            } else {
                setError(message.message);
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setPending(false);
            toast.success(`تم تغيير كلمة السر `, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 " onClose={() => {}}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-customGray-900 text-start"
                                    >
                                        نغيير كلمة السر
                                    </Dialog.Title>
                                    <form
                                        onSubmit={handleSubmitPasswordChange}
                                        className="text-center"
                                    >
                                        <div className="p-2 text-center text-red-400 rounded text-md">
                                            {error}
                                        </div>
                                        <div className="py-2 text-left">
                                            <input
                                                type="oldPassword"
                                                name="oldPassword"
                                                className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                                placeholder="رقم السر القديم"
                                                onChange={() => setError("")}
                                            />
                                        </div>
                                        <div className="py-2 text-left">
                                            <input
                                                name="newPassword"
                                                type="newPassword"
                                                className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                                placeholder="الرقم السري الجديد"
                                                onChange={() => setError("")}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end flex-grow gap-2 py-2">
                                            <button
                                                disabled={
                                                    status !== "authenticated"
                                                }
                                                type="submit"
                                                className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600 disabled:bg-customGray-100"
                                            >
                                                تغيير
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-customGray-900 bg-customGray-100 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

export default Header;
