import DateRange from "@/components/DateRange";
import Sidebar from "@/components/sidebar";
import { Category, Role, Sport } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { Fragment, useCallback, useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { categoriesPrismaRepo } from "@/lib/categories-repo-prisma";
import { getBaseUrl } from "@/lib/utils";
import TopCards from "@/components/TopCards";
import { aggregatedData } from "@/lib/data-repo-prisma";
import { sportsPrismaRepo } from "@/lib/sports-repo-prisma";
import { Dialog, Transition } from "@headlessui/react";
import { number, setErrorMap } from "zod";
import { useSession } from "next-auth/react";

export const Months = [
    { title: "يناير", value: 0 },
    { title: "فبراير", value: 1 },
    { title: "مارس", value: 2 },
    { title: "إبريل", value: 3 },
    { title: "مايو", value: 4 },
    { title: "يونيو", value: 5 },
    { title: "يوليو", value: 6 },
    { title: "أغسطس", value: 7 },
    { title: "سبتمبر", value: 8 },
    { title: "أكتوبر", value: 9 },
    { title: "نوفمبر", value: 10 },
    { title: "ديسمير", value: 11 },
] as const;
export const Years = [2023, 2024, 2025, 2026, 2027, 2028, 2029] as const;
const Weeks = [
    { title: "الأسبوع الأول", value: 1 },
    { title: "الأسبوع الثاني", value: 2 },
    { title: "الأسبوع الثالث", value: 3 },
    { title: "الأسبوع الأخير", value: 4 },
] as const;

export const FromWeeks = [
    { title: "الأسبوع الأول", value: 1 },
    { title: "الأسبوع الثاني", value: 8 },
    { title: "الأسبوع الثالث", value: 15 },
    { title: "الأسبوع الأخير", value: 22 },
] as const;
export const ToWeeks = [
    { title: "الأسبوع الأول", value: 7 },
    { title: "الأسبوع الثاني", value: 14 },
    { title: "الأسبوع الثالث", value: 21 },
    { title: "الأسبوع الأخير", value: 31 },
] as const;

export type RangeInputType = { from: string; to: string };

type DashboardProps = {
    categories: Category[] | null;
    sports: Sport[] | null;
};
const Dashboard = ({ categories, sports }: DashboardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sportsOptions, setSportsOptions] = useState<Sport[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [sportsList, setSportsList] = useState<aggregatedData[] | null>([]);
    const { data: Session, status } = useSession();

    const onCategoryChange = (category: Category | null) => {
        setCategory(category);
        setSportsList([]);
        setSportsOptions(
            sports?.filter((s) => s.categoryId === category?.id) ?? []
        );
    };

    const onRangeSelect = async ({ from, to }: RangeInputType) => {
        try {
            const response = await fetch(
                `${getBaseUrl()}/api/dashboard?from=${from}&to=${to}&categoryId=${
                    category?.id
                }`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const {
                sports,
                success,
            }: {
                success: boolean;
                sports: aggregatedData[] | null;
            } = await response.json();
            setSportsList(sports);
        } catch (error) {}
    };

    return (
        <div className="">
            <Sidebar
                onCategoryChange={onCategoryChange}
                categoriesList={categories}
            >
                <div className="container grid grid-cols-1 gap-2 p-1 mx-auto">
                    <POPUPQueue
                        isOpen={isOpen}
                        sports={sportsOptions}
                        closeModal={() => setIsOpen(false)}
                        categoryName={category?.name ?? ""}
                    />
                    <h1 className="mx-auto text-3xl font-bold text-orange-500">
                        {category?.title ?? "الكل"}
                    </h1>
                    {Session?.user.role === Role.OWNER ||
                    Session?.user.role === Role.ADMIN ? (
                        <button onClick={() => setIsOpen(true)}>OPEN</button>
                    ) : null}

                    <DateRange onRangeSelect={onRangeSelect} />
                    <TopCards
                        sportsData={sportsList ?? []}
                        category={category}
                    />
                </div>
            </Sidebar>
        </div>
    );
};

type POPUPQueueProps = {
    closeModal: () => void;
    isOpen: boolean;
    sports: Sport[];
    categoryName: string;
};

function POPUPQueue({
    closeModal,
    isOpen,
    sports,
    categoryName,
}: POPUPQueueProps) {
    const [date, setDate] = useState<{
        year: number;
        month: number;
        week: number;
    }>();
    const [totalPrice, setTotalPrice] = useState<string>("");
    const [totalRecites, setTotalRecites] = useState<string>("");
    const [error, setError] = useState("");
    const [selectedSportId, setSelectedSportId] = useState<number>();
    const [isLoading, setIsLoading] = useState(false);
    const [isOverride, setIsOverride] = useState(false);

    const reset = useCallback(() => {
        setTotalPrice("");
        setTotalRecites("");
        setError("");
        setIsOverride(false);
    }, []);

    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        setDate({ year, month, week: 1 });
        if (sports && sports.length > 0) {
            setSelectedSportId(sports[0].id);
        }
    }, [sports]);

    const clickHandler = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const dateRange = () => {
                switch (date?.week) {
                    case 1:
                        return {
                            from: new Date(
                                date.year,
                                date.month,
                                2
                            ).toISOString(),
                            to: new Date(
                                date.year,
                                date.month,
                                8
                            ).toISOString(),
                        };
                    case 2:
                        return {
                            from: new Date(
                                date.year,
                                date.month,
                                9
                            ).toISOString(),
                            to: new Date(
                                date.year,
                                date.month,
                                15
                            ).toISOString(),
                        };
                    case 3:
                        return {
                            from: new Date(
                                date.year,
                                date.month,
                                16
                            ).toISOString(),
                            to: new Date(
                                date.year,
                                date.month,
                                22
                            ).toISOString(),
                        };
                    case 4:
                        return {
                            from: new Date(
                                date.year,
                                date.month,
                                23
                            ).toISOString(),
                            to: new Date(
                                date.year,
                                date.month,
                                31
                            ).toISOString(),
                        };

                    default:
                        return null;
                }
            };
            if (
                !dateRange ||
                !totalRecites ||
                Number(totalRecites) < 1 ||
                !totalPrice ||
                Number(totalPrice) < 1
            )
                return;
            const result = await fetch(`${getBaseUrl()}/api/dashboard`, {
                method: isOverride ? "PUT" : "POST",
                body: JSON.stringify({
                    ...dateRange(),
                    sportId: selectedSportId,
                    totalRecites: Number(totalRecites),
                    totalPrice: Number(totalPrice),
                }),
                credentials: "include",
            });
            const {
                message,
                success,
            }: {
                success: boolean;
                message: string;
            } = await result.json();
            console.log(
                "🚀 ~ file: dashboard.tsx:244 ~ clickHandler ~ success:",
                success
            );
            if (success) {
                reset();
                closeModal();
            } else {
                setError(message ?? "error");
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setIsLoading(false);
        }
    };

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
                                        {`اضف البيانات ${categoryName} `}
                                    </Dialog.Title>
                                    <div className="flex flex-col justify-between gap-4 px-2 mt-2 flex-cols item-center">
                                        <div className="p-2 text-center text-red-400 rounded text-md">
                                            {error && JSON.stringify(error)}
                                        </div>
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="flex items-center flex-grow w-full gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                                                <select
                                                    value={date?.week}
                                                    onChange={(e) => {
                                                        setDate((prev) => ({
                                                            ...prev!,
                                                            week: +e.target
                                                                .value,
                                                        }));
                                                    }}
                                                    className="w-full px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-l-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                >
                                                    {Weeks.map((w) => (
                                                        <option
                                                            key={w.value}
                                                            value={w.value}
                                                        >
                                                            {w.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={date?.month}
                                                    onChange={(e) => {
                                                        setDate((prev) => ({
                                                            ...prev!,
                                                            month: +e.target
                                                                .value,
                                                        }));
                                                    }}
                                                    className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase sm:w-full bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                >
                                                    {Months.map((m) => (
                                                        <option
                                                            key={m.value}
                                                            value={m.value}
                                                        >
                                                            {m.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={date?.year}
                                                    onChange={(e) => {
                                                        setDate((prev) => ({
                                                            ...prev!,
                                                            year: +e.target
                                                                .value,
                                                        }));
                                                    }}
                                                    className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-r-none sm:w-full bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                >
                                                    {Years.map((y) => (
                                                        <option
                                                            key={y}
                                                            value={y}
                                                        >
                                                            {y}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center flex-grow w-full gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                                                <select
                                                    value={selectedSportId ?? 0}
                                                    onChange={(e) =>
                                                        setSelectedSportId(
                                                            +e.target.value
                                                        )
                                                    }
                                                    className="flex-grow px-2 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                >
                                                    {sports?.map((s) => (
                                                        <option
                                                            key={s.id}
                                                            value={s.id}
                                                        >
                                                            {s.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center flex-grow w-full gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                                                <input
                                                    placeholder="المبلغ"
                                                    type="text"
                                                    className="flex-grow px-2 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                    value={totalPrice}
                                                    onChange={(e) => {
                                                        setTotalPrice(
                                                            e.target.value
                                                        );
                                                        setError("");
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center flex-grow w-full gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                                                <input
                                                    placeholder="عدد الإيصالات"
                                                    type="text"
                                                    className="flex-grow px-2 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                                                    value={totalRecites}
                                                    onChange={(e) => {
                                                        setTotalRecites(
                                                            e.target.value
                                                        );
                                                        setError("");
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 py-2">
                                            <input
                                                className="mt-2 accent-customOrange-900"
                                                type="checkbox"
                                                name="hidden"
                                                checked={isOverride}
                                                onChange={(e) =>
                                                    setIsOverride(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="">تعديل</span>
                                        </div>
                                        <div className="flex items-center justify-end flex-grow gap-2">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-customOrange-900 bg-customOrange-100 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={clickHandler}
                                            >
                                                اضف
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-customGray-900 bg-customGray-100 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (
            !session ||
            (session &&
                session.user.role !== Role.OWNER &&
                session.user.role !== Role.ADMIN &&
                session.user.role !== Role.DASHBOARD)
        ) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
            };
        }
        const categoriesList = await categoriesPrismaRepo.getAll();
        const sportsList = await sportsPrismaRepo.getSportsName();
        return {
            props: {
                categories: JSON.parse(JSON.stringify(categoriesList)),
                sports: JSON.parse(JSON.stringify(sportsList)),
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
}

export default Dashboard;
