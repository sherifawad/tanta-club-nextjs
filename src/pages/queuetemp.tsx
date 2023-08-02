import { deleteCookies, parseCookies } from "@/lib/cookies";
import { Fragment, SyntheticEvent, useEffect, useRef, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Queue, QueueStatus, Role } from "types";
import { classNames, getBaseUrl, stringTrim } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps({
    req,
    res,
}: {
    req: NextApiRequest;
    res: NextApiResponse;
}) {
    const data = await fetch(`${getBaseUrl()}/api/queuetemp`);
    const { current } = await data.json();
    return {
        props: {
            current: current ?? null,
        }, // will be passed to the page component as props
    };
}

const TABS = ["جديد", "الحالي"] as const;

export default function QueueTempPage({ current = 0 }: { current: number }) {
    const router = useRouter();

    const { data: Session, status } = useSession();

    const [currentQueue, setCurrentQueue] = useState(current);

    const [currentNumber, setCurrentNumber] = useState<number | undefined>(0);

    const [messages, setMessages] = useState("");

    async function setCurrentQueueNumber(e: SyntheticEvent) {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            queueNumber: { value: number };
        };
        const number = target.queueNumber.value;
        console.log(
            "🚀 ~ file: queuetemp.tsx:45 ~ setCurrentQueueNumber ~ number:",
            number
        );
        const data = await fetch(`${getBaseUrl()}/api/queuetemp`, {
            method: "POST",
            body: JSON.stringify({
                number,
            }),
        });

        const { current }: { current: number } = await data.json();
        setCurrentQueue(current);
        setCurrentNumber(0);
    }

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (status !== "authenticated") {
                router.reload();
            }
        }, 120000);

        return () => {
            // 👇️ clear timeout when the component unmounts
            clearTimeout(timeoutID);
        };
    }, [router, status]);

    return (
        <div className="container grid mx-auto">
            <div className="max-w-md px-2 py-16 mx-auto ">
                <p className="text-xl text-center text-red-500 uppercase ">
                    {messages}
                </p>
                <Tab.Group onChange={() => setMessages("")}>
                    <Tab.List className="flex items-center justify-between gap-4 p-1 space-x-1 ">
                        {TABS.map((tab, idx) => (
                            <Tab
                                key={idx}
                                disabled={
                                    idx === 1 &&
                                    (status !== "authenticated" ||
                                        (status === "authenticated" &&
                                            Session.user.role === Role.CLIENT))
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
                                {tab}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels
                        className="mt-2"
                        onClick={() => setMessages("")}
                    >
                        <Tab.Panel
                            className={classNames(
                                "rounded-xl  p-3",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                            )}
                        >
                            <section className="flex flex-col gap-4 items-center justify-center  p-4 bg-white border border-customGray-100 rounded-lg  min-w-[15rem] min-h-[11rem] place-self-center shadow shadow-customOrange-900">
                                <span className="text-lg font-bold text-customOrange-900">
                                    الحالي
                                </span>
                                <p className="pb-2 text-3xl">{currentQueue}</p>
                                <div
                                    className="cursor-pointer text-start"
                                    onClick={() => router.reload()}
                                >
                                    🔄️
                                </div>
                            </section>
                        </Tab.Panel>
                        <Tab.Panel
                            className={classNames(
                                "rounded-xl p-3",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                            )}
                        >
                            <form
                                onSubmit={setCurrentQueueNumber}
                                className="flex flex-col  gap-4  p-4 bg-white border border-customGray-100 rounded-lg  min-w-[15rem] min-h-[11rem] place-self-center shadow shadow-customOrange-900"
                            >
                                <div className="flex flex-col items-center justify-center gap-4 ">
                                    <span className="text-lg font-bold text-customOrange-900">
                                        الحالي
                                    </span>
                                    <p className="text-3xl">{currentQueue}</p>
                                </div>
                                <label
                                    className="text-center text-customOrange-900 "
                                    htmlFor="queueNumber"
                                >
                                    رقم الدور الجديد
                                </label>
                                <input
                                    onChange={(e) =>
                                        setCurrentNumber(+e.target.value)
                                    }
                                    value={currentNumber}
                                    type="number"
                                    id="queueNumber"
                                    name="queueNumber"
                                    className="py-2 text-center bg-white border outline-none border-customOrange-900 rounded-xl"
                                />
                                <input
                                    type="submit"
                                    value="اضف"
                                    className="py-2 rounded-full shadow text-customOrange-900 bg-customOrange-100 shadow-customGray-900"
                                />
                            </form>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}
