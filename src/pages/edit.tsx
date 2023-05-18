import Search from "@/components/Search";
import SingleSelect from "@/components/SingleSelect";
import { categoriesRepo } from "@/lib/categories-repo";
import { discountsRepo } from "@/lib/discounts-repo";
import { penaltiesRepo } from "@/lib/penalties-repo";
import { sportsRepo } from "@/lib/sports-repo";
import { arrayToReactSelectOption } from "@/lib/utils";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import {
    Category,
    Discount,
    DiscountType,
    Penalty,
    RepetitionType,
    Role,
    Sport,
    User,
} from "types";

const TABS = ["رياضة", "نوع", "غرامه", "خصم", "مستخدم"] as const;

type EditProps = {
    categories: Category[] | null;
    discounts: Discount[] | null;
    penalties: Penalty[] | null;
    sports: Sport[] | null;
};
type BasicEditProps = {
    status: "authenticated" | "loading" | "unauthenticated";
    submitting: boolean;
    setSubmitting: Dispatch<SetStateAction<boolean>>;
    Session: Session | null;
};

const Edit = ({ categories, discounts, penalties, sports }: EditProps) => {
    const [selectedTab, setSelectedTab] =
        useState<(typeof TABS)[number]>("رياضة");
    const { data: Session, status } = useSession();
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className="container flex flex-col min-h-screen mx-auto">
            {status === "authenticated" && (
                <div className="flex flex-wrap gap-2 sm:mt-2">
                    {TABS.map((tab) => {
                        return (
                            <button
                                key={tab}
                                className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                                    tab === selectedTab
                                        ? "border-b-4 border-b-customOrange-900 font-bold"
                                        : "border-b-4 border-b-customGray-900"
                                }`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            )}
            <div className="flex justify-center mt-4">
                {renderSwitch({
                    selectedTab,
                    submitting,
                    setSubmitting,
                    Session,
                    status,
                    categories,
                    discounts,
                    penalties,
                    sports,
                })}
            </div>
        </div>
    );
};

function renderSwitch({
    selectedTab,
    submitting,
    setSubmitting,
    Session,
    status,
    categories,
    discounts,
    penalties,
    sports,
}: BasicEditProps & EditProps & { selectedTab: (typeof TABS)[number] }) {
    switch (selectedTab) {
        case "رياضة":
            return (
                <SportEdit
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    Session={Session}
                    status={status}
                    categories={categories}
                    discounts={discounts}
                    penalties={penalties}
                    sports={sports}
                />
            );
        case "مستخدم":
            return (
                <UserEdit
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    Session={Session}
                    status={status}
                />
            );
        case "خصم":
            return (
                <DiscountEdit
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    Session={Session}
                    status={status}
                    discounts={discounts}
                />
            );
        case "غرامه":
            return (
                <PenaltyEdit
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    Session={Session}
                    status={status}
                    penalties={penalties}
                />
            );
        case "نوع":
            return (
                <CategoryEdit
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    Session={Session}
                    status={status}
                    categories={categories}
                />
            );
        default:
            return "404 خطأ";
    }
}

function UserEdit({
    submitting,
    setSubmitting,
    Session,
    status,
}: BasicEditProps) {
    const [error, setError] = useState("");
    const handleSubmitSignUp = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
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

            const data = await fetch("http://localhost:3000/api/signup", {
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

    return (
        <div className="">
            <form onSubmit={handleSubmitSignUp} className="text-center">
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
                            disabled={Session?.user.role != Role.OWNER}
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
        </div>
    );
}

function DiscountEdit({
    submitting,
    setSubmitting,
    Session,
    status,
    discounts,
}: BasicEditProps & { discounts: Discount[] | null }) {
    const [error, setError] = useState("");
    const [data, setData] = useState<Discount>({
        id: 0,
        type: DiscountType.PERCENTAGE,
        title: "",
        minimum: 0,
        Maximum: 0,
        step: 0,
        name: "",
    } as Discount);

    const handleSelectChange = (id: number) => {
        const findData = discounts?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setData({ ...findData });
    };

    // handle on change according to input name and setState
    const handleChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSubmitDiscount = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
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

            const data = await fetch("http://localhost:3000/api/signup", {
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

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmitDiscount}
                className="text-center max-w-[20rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    خصم
                </h1>
                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                discounts ?? []
                            ) ?? []
                        }
                        onChange={handleSelectChange}
                        name="discount"
                    />
                </div>
                <div className="p-2 text-center text-red-400 rounded text-md">
                    {error}
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالعربي"
                        value={data.title ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="name"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالانجليزي"
                        value={data.name}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="minimum"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الحد الادنى"
                        value={data.minimum}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="Maximum"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الحد الاقصى"
                        value={data.Maximum}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="step"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="معدل الخصم"
                        value={data.step}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <select
                        value={data.type}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-700"
                        name="type"
                    >
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={DiscountType.FIXED}
                        >
                            خصم مبلغ ثابت
                        </option>
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={DiscountType.PERCENTAGE}
                        >
                            خصم نسبة
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
        </div>
    );
}

function PenaltyEdit({
    submitting,
    setSubmitting,
    Session,
    status,
    penalties,
}: BasicEditProps & { penalties: Penalty[] | null }) {
    const [error, setError] = useState("");
    const handleSubmitPenalty = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
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

            const data = await fetch("http://localhost:3000/api/signup", {
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

    return (
        <div className="">
            <form onSubmit={handleSubmitPenalty} className="text-center">
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    غرامه
                </h1>
                <div className="p-2 text-center text-red-400 rounded text-md">
                    {error}
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالعربي"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="name"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالانجليزي"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="minimum"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الحد الادنى"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="Maximum"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الحد الاقصى"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="step"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="معدل الخصم"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <select
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-700"
                        name="type"
                    >
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={DiscountType.FIXED}
                        >
                            خصم مبلغ ثابت
                        </option>
                        <option
                            disabled={Session?.user.role != Role.OWNER}
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={DiscountType.PERCENTAGE}
                        >
                            خصم نسبة
                        </option>
                    </select>
                </div>
                <div className="py-2 text-left">
                    <select
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-700"
                        name="repeat"
                    >
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={RepetitionType.DAILY}
                        >
                            تكرار يومي
                        </option>
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={RepetitionType.MONTHLY}
                        >
                            تكرار شهري
                        </option>
                        <option
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={RepetitionType.YEARLY}
                        >
                            تكرار سنوي
                        </option>
                    </select>
                </div>
                <div className="py-2 text-left">
                    <input
                        name="startDay"
                        type="date"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="بداية الخصم"
                        onChange={() => setError("")}
                    />
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
        </div>
    );
}

function CategoryEdit({
    submitting,
    setSubmitting,
    Session,
    status,
    categories,
}: BasicEditProps & { categories: Category[] | null }) {
    const [error, setError] = useState("");
    const handleSubmitCategory = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
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

            const data = await fetch("http://localhost:3000/api/signup", {
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

    return (
        <div className="">
            <form onSubmit={handleSubmitCategory} className="text-center">
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    فئة الرياضة
                </h1>
                <div className="p-2 text-center text-red-400 rounded text-md">
                    {error}
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالعربي"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="name"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالانجليزي"
                        onChange={() => setError("")}
                    />
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
        </div>
    );
}

function SportEdit({
    submitting,
    setSubmitting,
    Session,
    status,
    categories,
    discounts,
    penalties,
    sports,
}: BasicEditProps & EditProps) {
    const [error, setError] = useState("");
    const handleSubmitSport = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
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

            const data = await fetch("http://localhost:3000/api/signup", {
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

    return (
        <div className="">
            <form onSubmit={handleSubmitSport} className="text-center">
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    الرياضة
                </h1>
                <Search onChange={() => {}} value={""} />

                <div className="p-2 text-center text-red-400 rounded text-md">
                    {error}
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالعربي"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="name"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم بالانجليزي"
                        onChange={() => setError("")}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="number"
                        name="price"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="السعر"
                        onChange={() => setError("")}
                    />
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
        </div>
    );
}

export async function getServerSideProps() {
    try {
        const categories = categoriesRepo.getAll();
        const sports = sportsRepo.getAll();
        const discounts = discountsRepo.getAll();
        const penalties = penaltiesRepo.getAll();
        return {
            props: {
                categories: categories ? categories : null,
                discounts: discounts ? discounts : null,
                penalties: penalties ? penalties : null,
                sports: sports ? sports : null,
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
}

export default Edit;
