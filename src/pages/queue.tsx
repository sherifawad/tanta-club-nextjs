import { deleteCookies, parseCookies } from "@/lib/cookies";
import { Fragment, useEffect, useRef, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { Dialog, Transition } from "@headlessui/react";
import { Queue, QueueStatus } from "types";
import { stringTrim } from "@/lib/utils";

export async function getServerSideProps({
    req,
    res,
}: {
    req: NextApiRequest;
    res: NextApiResponse;
}) {
    const { QUEUE } = parseCookies(req);
    const data = await fetch("http://localhost:3000/api/hello", {
        method: "POST",
        body:
            QUEUE != null && QUEUE.length > 1
                ? JSON.stringify({
                      id: JSON.parse(QUEUE).id,
                      code: JSON.parse(QUEUE).code,
                      force: false,
                  })
                : null,
    });
    const { current, queue } = await data.json();
    return {
        props: { current: current ?? null, queueCookie: queue ?? null }, // will be passed to the page component as props
    };
}
type POPUPQueueProps = {
    clickHandler: (code: string, force: boolean) => Promise<void>;
    closeModal: () => void;
    isOpen: boolean;
};

function POPUPQueue({ closeModal, isOpen, clickHandler }: POPUPQueueProps) {
    const [year, setYear] = useState("");
    const [code, setCode] = useState("");
    const [force, setForce] = useState(false);

    async function GetQueueNumber() {
        if (code.length < 1 || code.length > 5 || isNaN(Number(code))) return;
        if (year.length !== 4 || isNaN(Number(year))) return;
        await clickHandler(year + "," + code, force);
        closeModal();
        // setYear("");
        // setCode("");
        setForce(false);
    }
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                                        اضف العضوية
                                    </Dialog.Title>
                                    <div className="flex flex-col justify-between gap-4 px-2 mt-2 flex-cols item-center">
                                        <div className="grid grid-cols-2 place-content-center place-items-center">
                                            <label htmlFor="year" className="">
                                                سنة العضوية
                                            </label>
                                            <label htmlFor="code" className="">
                                                رقم العضوية
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 px-3 py-2 bg-customGray-100 rounded-full overflow-x-clip">
                                            <input
                                                className="[appearance:textfield] outline-none bg-customGray-100 w-full sm:px-4 placeholder:text-center"
                                                name="year"
                                                id="year"
                                                type="number"
                                                placeholder="سنة العضوية"
                                                value={year}
                                                onChange={(e) =>
                                                    setYear(
                                                        stringTrim(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                            <span>/</span>
                                            <input
                                                className="[appearance:textfield] outline-none bg-customGray-100 w-full sm:px-4 placeholder:text-center"
                                                name="code"
                                                id="code"
                                                type="number"
                                                placeholder="رقم العضوية"
                                                value={code}
                                                onChange={(e) =>
                                                    setCode(
                                                        stringTrim(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 mt-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                className="mt-1 accent-customOrange-900"
                                                type="checkbox"
                                                checked={force}
                                                onChange={(e) =>
                                                    setForce(e.target.checked)
                                                }
                                            />
                                            <span className="text-xs font-bold text-customOrange-900">
                                                يجب الحصول على رقم جديد
                                            </span>
                                        </label>
                                        <div className="flex items-center justify-end flex-grow gap-2">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-customOrange-900 bg-customOrange-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={GetQueueNumber}
                                            >
                                                احصل على رقم
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-customGray-900 bg-customGray-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}

// export const useDocument = () => {
//     const [myDocument, setMyDocument] = useState<any>(null);

//     useEffect(() => {
//         setMyDocument(document);
//     }, []);

//     return myDocument;
// };

export default function QueuePage({
    current = 0,
    queueCookie,
}: {
    current: number;
    queueCookie: Queue | undefined;
}) {
    const [queueNumber, setQueueNumberState] = useState<Queue | undefined>(
        queueCookie
    );
    const [currentQueue, setCurrentQueue] = useState<Queue | undefined>(
        undefined
    );

    const [currentNumber, setCurrentNumber] = useState(current);

    const [openModel, setOpenModel] = useState(false);

    async function getQueue(code: string, force: boolean = false) {
        const data = await fetch("http://localhost:3000/api/hello", {
            method: "POST",
            body: JSON.stringify({ id: undefined, code, force }),
        });
        const { queue, current }: { queue: Queue; current: number } =
            await data.json();
        setCurrentNumber(current);
        if (current <= queue.id) {
            setQueueNumberState(queue);
        }
    }
    async function completeQueue(id: number | undefined, status: QueueStatus) {
        if (!id || id === null) return;
        const data = await fetch("http://localhost:3000/api/hello", {
            method: "PUT",
            body: JSON.stringify({ id, status }),
        });
        const { queue }: { queue: Queue } = await data.json();
        setCurrentQueue(queue);
    }

    async function getCurrentQueue() {
        const data = await fetch("http://localhost:3000/api/hello", {
            method: "POST",
        });
        const { queue, current }: { queue: Queue; current: number } =
            await data.json();
        setCurrentQueue(queue);
    }

    return (
        <div className="container grid min-h-screen mx-auto">
            <POPUPQueue
                isOpen={openModel}
                closeModal={() => setOpenModel(false)}
                clickHandler={getQueue}
            />

            <section className="flex flex-col gap-4  p-4 bg-white border border-customGray-100 rounded-lg  min-w-[15rem] min-h-[11rem] place-self-center shadow shadow-customOrange-900">
                <div className="flex flex-col items-center gap-2 border-b border-dashed">
                    <span className="text-lg font-bold text-customOrange-900">
                        الحالي
                    </span>
                    <p className="pb-2 text-3xl">{currentNumber}</p>
                </div>
                <div className="flex flex-col items-center gap-2 border-b border-dashed">
                    <span className="text-lg font-bold text-customOrange-900">
                        رقمك
                    </span>
                    <p className="text-3xl">{queueNumber?.id}</p>
                    <p className="pb-2 text-lg text-customGray-900">
                        {queueNumber?.status}
                    </p>
                </div>
                <button
                    onClick={() => setOpenModel(true)}
                    className="py-2 text-customOrange-900 bg-customOrange-100 rounded-full shadow shadow-customGray-900"
                >
                    احصل على دور
                </button>
            </section>
            <section className="flex flex-col gap-4  p-4 bg-white border border-customGray-100 rounded-lg  min-w-[15rem] min-h-[11rem] place-self-center shadow shadow-customOrange-900">
                <button
                    onClick={getCurrentQueue}
                    className="py-2 text-customOrange-900 bg-customOrange-100 rounded-full shadow shadow-customGray-900"
                >
                    الحالي
                </button>
                <div className="flex flex-col items-center gap-2 border-b border-dashed">
                    <p className="pb-2 text-3xl">{currentQueue?.id}</p>
                    <div className="flex items-center justify-center gap-2">
                        <p className="pb-2 text-3xl">
                            {currentQueue?.code.split(",")[0]}
                        </p>
                        <span className="pb-2 text-3xl">/</span>
                        <p className="pb-2 text-3xl">
                            {currentQueue?.code.split(",")[1]}
                        </p>
                    </div>
                    <p className="pb-2 text-lg text-customGray-900">
                        {currentQueue?.status}
                    </p>
                </div>
                <div className="flex items-center justify-around w-full gap-2">
                    <button
                        onClick={() =>
                            completeQueue(
                                currentQueue?.id,
                                QueueStatus.COMPLETED
                            )
                        }
                        className="p-2 text-customOrange-900 bg-customOrange-100 rounded-md shadow shadow-customGray-900"
                    >
                        تم
                    </button>
                    <button
                        onClick={() =>
                            completeQueue(currentQueue?.id, QueueStatus.MISSED)
                        }
                        className="p-2 text-customOrange-900 bg-customOrange-100 rounded-md shadow shadow-customGray-900"
                    >
                        لم يحضر
                    </button>
                    <button
                        onClick={() =>
                            completeQueue(
                                currentQueue?.id,
                                QueueStatus.POSTPONE
                            )
                        }
                        className="p-2 text-customOrange-900 bg-customOrange-100 rounded-md shadow shadow-customGray-900"
                    >
                        تأجيل
                    </button>
                </div>
            </section>
        </div>
    );
}
