import { Tab } from "@headlessui/react";
import { stat } from "fs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useState } from "react";
import { Role, User } from "types";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Auth() {
    const router = useRouter();
    const { tab = "login" } = router.query;
    const { data: Session, status } = useSession();
    let [categories] = useState(["دخول", "تسجيل"]);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleSubmitLogIn = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (status === "authenticated") return;
            setSubmitting(true);
            const target = e.target as typeof e.target & {
                name: { value: string };
                password: { value: string };
            };
            const name = target.name.value; // typechecks!
            const password = target.password.value; // typechecks!
            if (!name || name.length < 0 || !password || password.length < 0)
                return;
            const res = await signIn("username-login", {
                redirect: false,
                username: name,
                password,
                callbackUrl: `${window.location.origin}`,
            });
            if (res?.error) {
                setError(res.error);
            } else {
                setError("");
            }
            if (res?.url) router.push(res.url);
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };
    const handleSubmitSignUp = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session.user.role !== Role.ADMIN &&
                    Session.user.role !== Role.OWNER)
            )
                return;
            setSubmitting(true);
            const target = e.target as typeof e.target & {
                name: { value: string };
                password: { value: string };
                role: { value: string };
            };

            const name = target.name.value; // typechecks!
            const password = target.password.value; // typechecks!
            const role = target.role.value; // typechecks!
            if (
                !name ||
                name.length < 0 ||
                !password ||
                password.length < 0 ||
                !role ||
                !(role in Role) ||
                role.length < 0
            )
                return;

            const data = await fetch(`${getBaseUrl()}/api/signup`, {
                method: "POST",
                body: JSON.stringify({ name, password, role }),
                credentials: "include",
            });
            const { storeUser, message }: { storeUser: User; message: string } =
                await data.json();
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        setSelectedIndex(tab === "signup" ? 1 : 0);
    }, [tab]);

    return (
        <div className="max-w-md px-2 py-16 mx-auto ">
            <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
            >
                <Tab.List className="flex items-center justify-between gap-4 p-1 space-x-1 ">
                    {categories.map((category, idx) => (
                        <Tab
                            key={idx}
                            disabled={
                                (idx === 1 &&
                                    (status !== "authenticated" ||
                                        (status === "authenticated" &&
                                            Session.user.role !== Role.OWNER &&
                                            Session.user.role !==
                                                Role.ADMIN))) ||
                                (idx === 0 && status === "authenticated")
                            }
                            className={({ selected }) =>
                                classNames(
                                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-customOrange-900",
                                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                    selected
                                        ? "bg-white shadow shadow-customOrange-900"
                                        : "bg-customGray-900 text-white hover:bg-customGray-100 hover:text-white"
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel
                        className={classNames(
                            "rounded-xl  p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none"
                        )}
                    >
                        <form
                            onSubmit={handleSubmitLogIn}
                            className="text-center"
                        >
                            <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                                تسجيل الدخول
                            </h1>
                            <div className="p-2 text-center text-red-400 rounded text-md">
                                {error}
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    type="text"
                                    name="name"
                                    className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                    placeholder="الاسم"
                                    onChange={() => setError("")}
                                />
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    name="password"
                                    type="password"
                                    className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                    placeholder="الرقم السري"
                                    onChange={() => setError("")}
                                />
                            </div>
                            <div className="py-2">
                                <button
                                    disabled={status === "authenticated"}
                                    type="submit"
                                    className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600 disabled:bg-customGray-100"
                                >
                                    دخول
                                </button>
                            </div>
                        </form>
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            "rounded-xl p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none"
                        )}
                    >
                        <form
                            onSubmit={handleSubmitSignUp}
                            className="text-center"
                        >
                            <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                                تسجيل مستخدم جديد
                            </h1>
                            <div className="p-2 text-center text-red-400 rounded text-md">
                                {error}
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    type="text"
                                    name="name"
                                    className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                    placeholder="الاسم"
                                    onChange={() => setError("")}
                                />
                            </div>
                            <div className="py-2 text-left">
                                <input
                                    name="password"
                                    type="password"
                                    className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                                    placeholder="الرقم السري"
                                    onChange={() => setError("")}
                                />
                            </div>
                            <div className="py-2 text-left">
                                <select
                                    className="block w-full px-4 py-2 text-gray-400 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700"
                                    name="role"
                                >
                                    <option
                                        className="block w-full px-4 py-2 bg-gray-100"
                                        value={Role.USER}
                                    >
                                        مستخدم
                                    </option>
                                    <option
                                        disabled={
                                            Session?.user.role != Role.OWNER
                                        }
                                        className="block w-full px-4 py-2 bg-gray-100"
                                        value={Role.ADMIN}
                                    >
                                        ادمن
                                    </option>
                                </select>
                            </div>
                            <div className="py-2">
                                <button
                                    type="submit"
                                    className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                                >
                                    تسجيل
                                </button>
                            </div>
                        </form>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
