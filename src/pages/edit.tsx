import Search from "@/components/Search";
import SingleSelect from "@/components/SingleSelect";
import { categoriesRepo } from "@/lib/categories-repo";
import { discountsRepo } from "@/lib/discounts-repo";
import { penaltiesRepo } from "@/lib/penalties-repo";
import { sportsRepo } from "@/lib/sports-repo";
import { usersRepo } from "@/lib/users-repo";
import { arrayToReactSelectOption } from "@/lib/utils";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession, type Session } from "next-auth";
import { useSession } from "next-auth/react";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    useState,
} from "react";
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
import { authOptions } from "./api/auth/[...nextauth]";
import { title } from "process";

const TABS = ["رياضة", "نوع", "غرامه", "خصم", "مستخدم"] as const;

type EditProps = {
    categories: Category[] | null;
    discounts: Discount[] | null;
    penalties: Penalty[] | null;
    sports: Sport[] | null;
    users: User[] | null;
};
type BasicEditProps = {
    status: "authenticated" | "loading" | "unauthenticated";
    submitting: boolean;
    setSubmitting: Dispatch<SetStateAction<boolean>>;
    Session: Session | null;
};

const Edit = ({
    categories,
    discounts,
    penalties,
    sports,
    users,
}: EditProps) => {
    const [selectedTab, setSelectedTab] =
        useState<(typeof TABS)[number]>("رياضة");
    const { data: Session, status } = useSession();
    const [submitting, setSubmitting] = useState(false);
    if (
        status !== "authenticated" ||
        (status === "authenticated" &&
            Session.user.role !== Role.OWNER &&
            Session.user.role !== Role.ADMIN)
    ) {
        return (
            <h1 className="grid min-h-[50vh] place-content-center place-items-center">
                <p className="text-xl font-bold">غير مصرح</p>
            </h1>
        );
    }

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
                    users,
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
    users,
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
                    users={users}
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
    users,
}: BasicEditProps & { users: User[] | null }) {
    const [usersList, setUsersList] = useState(users ?? []);
    const [error, setError] = useState("");
    const [selectValue, setSelectValue] = useState<any>(null);
    const defaultValues = {
        id: 0,
        name: "",
        role: Role.CLIENT,
        password: "",
    } as User;
    const [data, setData] = useState<User>(defaultValues);
    const [userIsEnabled, setUserIsEnabled] = useState(true);

    const handleSelectChange = (id: number) => {
        const findData = users?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setSelectValue(findData.id);
        setData({ ...findData });
        setUserIsEnabled(findData.enabled);
    };
    // handle on change according to input name and setState
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value.trim() });
    };

    const reset = () => {
        setData(defaultValues);
        setSelectValue(null);
        setUserIsEnabled(true);
        setError("");
    };

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
            if (
                !data.name ||
                data.name.length < 0 ||
                (data.id === 0 &&
                    (!data.password || data.password.length < 0)) ||
                !data.role ||
                !(data.role in Role) ||
                data.role.length < 0
            ) {
                return;
            }

            const result = await fetch("http://localhost:3000/api/signup", {
                method: data.id ? "PUT" : "POST",
                body: JSON.stringify({ ...data, enabled: userIsEnabled }),
                credentials: "include",
            });
            const {
                storeUser,
                message,
                success,
            }: {
                success: boolean;
                storeUser: User;
                message: string;
            } = await result.json();
            if (success) {
                if (storeUser) {
                    setUsersList((prev) => [...prev, storeUser]);
                } else {
                    setUsersList((prev) =>
                        prev?.map((user) => {
                            if (user.id === data.id) {
                                return { ...data, enabled: userIsEnabled };
                            } else {
                                return user;
                            }
                        })
                    );
                }
                reset();
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitSignUp}
                className="text-center max-w-[20rem] min-w-[18rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    مستخدم
                </h1>
                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <button
                        type="button"
                        className="flex gap-2 pl-2 mx-2 border-l-2 border-l-customGray-900 whitespace-nowrap"
                        onClick={reset}
                    >
                        جديد
                        <span className="font-bold text-customOrange-900">
                            +
                        </span>
                    </button>
                    <SingleSelect
                        options={
                            arrayToReactSelectOption("name", "id", usersList) ??
                            []
                        }
                        onChange={handleSelectChange}
                        value={selectValue}
                        name="discount"
                    />
                </div>
                <div className="p-2 text-center text-red-400 rounded text-md">
                    {error}
                </div>
                <div className="py-2 text-left">
                    <input
                        type="text"
                        name="name"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الاسم"
                        value={data.name ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="password"
                        type="password"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="الرقم السري"
                        value={data.password ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <select
                        value={data.role ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700"
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
                        <option
                            disabled={Session?.user.role != Role.OWNER}
                            className="block w-full px-4 py-2 bg-gray-100"
                            value={Role.OWNER}
                        >
                            مالك
                        </option>
                    </select>
                </div>
                <div className="flex items-center gap-2 py-2">
                    <input
                        className="mt-2 accent-customOrange-900"
                        type="checkbox"
                        name="hidden"
                        checked={userIsEnabled}
                        onChange={(e) => setUserIsEnabled(e.target.checked)}
                    />
                    <span className="">مفعل</span>
                </div>
                <div className="py-2">
                    <button
                        type="submit"
                        className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                    >
                        {!data.id || data.id == null ? "تسجيل" : "تعديل"}
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
    const [discountsList, setDiscountsList] = useState(discounts ?? []);
    const [error, setError] = useState("");
    const [enabled, setEnabled] = useState(true);

    const [selectValue, setSelectValue] = useState<any>(null);
    const defaultValues = {
        id: 0,
        type: DiscountType.PERCENTAGE,
        title: "",
        minimum: 0,
        Maximum: 0,
        step: 0,
        name: "",
    } as Discount;
    const [data, setData] = useState<Discount>(defaultValues);
    const reset = () => {
        setData(defaultValues);
        setSelectValue(null);
        setEnabled(true);
        setError("");
    };
    const handleSelectChange = (id: number) => {
        const findData = discounts?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setSelectValue(findData.id);
        setData({ ...findData });

        setEnabled(findData.enabled);
    };

    // handle on change according to input name and setState
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value.trim() });
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
            if (
                !data.name ||
                data.name.length < 0 ||
                !data.title ||
                data.title.length < 0 ||
                !data.type ||
                !(data.type in DiscountType) ||
                data.type.length < 0 ||
                data.minimum === 0 ||
                data.Maximum === 0
            )
                return;

            const response = await fetch(
                "http://localhost:3000/api/discounts",
                {
                    method: data.id ? "PUT" : "POST",
                    body: JSON.stringify({ ...data, enabled }),
                    credentials: "include",
                }
            );
            const {
                storeDiscount,
                message,
                success,
            }: {
                success: boolean;
                storeDiscount: Discount;
                message: string;
            } = await response.json();

            if (success) {
                if (storeDiscount) {
                    setDiscountsList((prev) => [...prev, storeDiscount]);
                } else {
                    setDiscountsList((prev) =>
                        prev?.map((discount) => {
                            if (discount.id === data.id) {
                                return { ...data, enabled };
                            } else {
                                return discount;
                            }
                        })
                    );
                }
                reset();
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitDiscount}
                className="text-center max-w-[20rem] min-w-[18rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    خصم
                </h1>
                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <button
                        type="button"
                        className="flex gap-2 pl-2 mx-2 border-l-2 border-l-customGray-900 whitespace-nowrap"
                        onClick={reset}
                    >
                        جديد
                        <span className="font-bold text-customOrange-900">
                            +
                        </span>
                    </button>
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                discountsList ?? []
                            ) ?? []
                        }
                        onChange={handleSelectChange}
                        value={selectValue}
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
                <div className="flex items-center gap-2 py-2">
                    <input
                        className="mt-2 accent-customOrange-900"
                        type="checkbox"
                        name="hidden"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                    <span className="">مفعل</span>
                </div>
                <div className="py-2">
                    <button
                        type="submit"
                        className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                    >
                        {!data.id || data.id == null ? "تسجيل" : "تعديل"}
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
    const [penaltiesList, setPenaltiesList] = useState(penalties ?? []);
    const [enabled, setEnabled] = useState(true);

    const [error, setError] = useState("");
    const [selectValue, setSelectValue] = useState<any>(null);
    const defaultValues = {
        id: 0,
        repeated: RepetitionType.DAILY,
        type: DiscountType.FIXED,
        title: "",
        minimum: 0,
        Maximum: 0,
        step: 0,
        name: "",
        start: 0,
        end: 0,
    } as Penalty;
    const [data, setData] = useState<Penalty>(defaultValues);

    const reset = () => {
        setData(defaultValues);
        setSelectValue(null);
        setEnabled(true);
        setError("");
    };
    const handleSelectChange = (id: number) => {
        const findData = penalties?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setSelectValue(findData.id);
        setData({ ...findData });
        setEnabled(findData.enabled);
    };

    // handle on change according to input name and setState
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value.trim() });
    };
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
            if (
                !data.name ||
                data.name.length < 0 ||
                !data.title ||
                data.title.length < 0 ||
                !data.repeated ||
                !(data.repeated in RepetitionType) ||
                data.repeated.length < 0 ||
                !data.type ||
                !(data.type in DiscountType) ||
                data.type.length < 0 ||
                data.minimum === 0 ||
                data.Maximum === 0 ||
                data.start === 0
            )
                return;

            const response = await fetch(
                "http://localhost:3000/api/penalties",
                {
                    method: data.id ? "PUT" : "POST",
                    body: JSON.stringify({ ...data, enabled }),
                    credentials: "include",
                }
            );
            const {
                storePenalty,
                message,
                success,
            }: {
                success: boolean;
                storePenalty: Penalty;
                message: string;
            } = await response.json();

            if (success) {
                if (storePenalty) {
                    setPenaltiesList((prev) => [...prev, storePenalty]);
                } else {
                    setPenaltiesList((prev) =>
                        prev?.map((penalty) => {
                            if (penalty.id === data.id) {
                                return { ...data, enabled };
                            } else {
                                return penalty;
                            }
                        })
                    );
                }
                reset();
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitPenalty}
                className="text-center max-w-[20rem] min-w-[18rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    غرامه
                </h1>
                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <button
                        type="button"
                        className="flex gap-2 pl-2 mx-2 border-l-2 border-l-customGray-900 whitespace-nowrap"
                        onClick={reset}
                    >
                        جديد
                        <span className="font-bold text-customOrange-900">
                            +
                        </span>
                    </button>
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                penaltiesList
                            ) ?? []
                        }
                        onChange={handleSelectChange}
                        value={selectValue}
                        name="penalty"
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
                        value={data.name ?? ""}
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
                        value={data.minimum ?? ""}
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
                        value={data.Maximum ?? ""}
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
                        value={data.step ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <select
                        value={data.type ?? ""}
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
                        value={data.repeated ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
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
                        name="start"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="بداية الغرامة"
                        value={data.start ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        name="end"
                        type="number"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="نهاية الغرامة"
                        value={data.end ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input
                        className="mt-2 accent-customOrange-900"
                        type="checkbox"
                        name="hidden"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                    <span className="">مفعل</span>
                </div>
                <div className="py-2">
                    <button
                        type="submit"
                        className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                    >
                        {!data.id || data.id == null ? "تسجيل" : "تعديل"}
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
    const [categoryList, setCategoryList] = useState(categories ?? []);
    const [error, setError] = useState("");
    const [selectValue, setSelectValue] = useState<any>(null);
    const defaultValues = {
        id: 0,
        title: "",
        name: "",
    } as Category;
    const [data, setData] = useState<Category>(defaultValues);
    const [categoryIsHidden, setCategoryIsHidden] = useState(false);

    const reset = () => {
        setData(defaultValues);
        setSelectValue(null);
        setCategoryIsHidden(false);
        setError("");
    };
    const handleSelectChange = (id: number) => {
        const findData = categoryList?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setSelectValue(findData.id);
        setData({ ...findData });
        setCategoryIsHidden(findData.hidden);
    };

    // handle on change according to input name and setState
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value.trim() });
    };
    const handleSubmitCategory = async (e: SyntheticEvent) => {
        try {
            e.preventDefault();
            if (submitting) return;
            if (
                status !== "authenticated" ||
                (status === "authenticated" &&
                    Session?.user.role !== Role.ADMIN &&
                    Session?.user.role !== Role.OWNER)
            ) {
                return;
            }
            setSubmitting(true);
            if (
                !data.name ||
                data.name.length < 0 ||
                !data.title ||
                data.title.length < 0
            )
                return;

            const response = await fetch(
                "http://localhost:3000/api/categories",
                {
                    method: data.id ? "PUT" : "POST",
                    body: JSON.stringify({ ...data, hidden: categoryIsHidden }),
                    credentials: "include",
                }
            );
            const {
                message,
                success,
                storeCategory,
            }: {
                success: boolean;
                message: string;
                storeCategory: Category | undefined;
            } = await response.json();
            if (success) {
                if (storeCategory) {
                    setCategoryList((prev) => [...prev, storeCategory]);
                } else {
                    setCategoryList((prev) =>
                        prev?.map((cat) => {
                            if (cat.id === data.id) {
                                return { ...data, hidden: categoryIsHidden };
                            } else {
                                return cat;
                            }
                        })
                    );
                }
                reset();
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitCategory}
                className="text-center max-w-[20rem] min-w-[18rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    فئة الرياضة
                </h1>

                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <button
                        type="button"
                        className="flex gap-2 pl-2 mx-2 border-l-2 border-l-customGray-900 whitespace-nowrap"
                        onClick={reset}
                    >
                        جديد
                        <span className="font-bold text-customOrange-900">
                            +
                        </span>
                    </button>
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                categoryList
                            ) ?? []
                        }
                        onChange={handleSelectChange}
                        value={selectValue}
                        name="category"
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
                        value={data.name ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input
                        className="mt-2 accent-customOrange-900"
                        type="checkbox"
                        name="hidden"
                        checked={!categoryIsHidden}
                        onChange={(e) => setCategoryIsHidden(!e.target.checked)}
                    />
                    <span className="">مفعل</span>
                </div>
                <div className="py-2">
                    <button
                        type="submit"
                        className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                    >
                        {!data.id || data.id == null ? "تسجيل" : "تعديل"}
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
}: BasicEditProps & Omit<EditProps, "users">) {
    const [sportsList, setSportsList] = useState(sports ?? []);
    const [error, setError] = useState("");
    const [selectValue, setSelectValue] = useState<any>(null);
    const defaultValues = {
        id: 0,
        name: "",
        title: "",
        price: 0,
    } as Sport;
    const [data, setData] = useState<Sport>(defaultValues);
    const [sportIsHidden, setSportIsHidden] = useState(false);
    const [penaltyId, setPenaltyId] = useState(0);
    const [categoryId, setCategoryId] = useState(0);
    const [discountList, setDiscountList] = useState<number[] | null>(null);

    const handleSelectChange = (id: number) => {
        const findData = sports?.find((x) => x.id === id);
        if (!findData || findData === null) return;
        setSelectValue(findData.id);
        setData({ ...findData });
        setSportIsHidden(findData.hidden);
        setCategoryId(findData.categoryId);
        setPenaltyId(findData.penaltyId ?? 0);
        setDiscountList((findData.discounts ?? []).map((d) => d.id));
    };

    // handle on change according to input name and setState
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData({ ...data, [e.target.name]: e.target.value.trim() });
    };

    const reset = () => {
        setData(defaultValues);
        setSelectValue(null);
        setSportIsHidden(false);
        setError("");
        setCategoryId(0);
        setPenaltyId(0);
        setDiscountList(null);
    };
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
            if (
                !data.name ||
                data.name.length < 0 ||
                !data.title ||
                data.title.length < 0 ||
                data.categoryId === 0 ||
                data.price === 0
            )
                return;

            const response = await fetch("http://localhost:3000/api/sports", {
                method: data.id ? "PUT" : "POST",
                body: JSON.stringify({
                    ...data,
                    hidden: sportIsHidden,
                    categoryId,
                    penaltyId,
                    discounts: discountList,
                }),
                credentials: "include",
            });
            const {
                storeSport,
                message,
                success,
            }: {
                success: boolean;
                storeSport: Sport;
                message: string;
            } = await response.json();

            if (success) {
                if (storeSport) {
                    setSportsList((prev) => [...prev, storeSport]);
                } else {
                    setSportsList((prev) =>
                        prev?.map((sport) => {
                            if (sport.id === data.id) {
                                return {
                                    ...data,
                                    hidden: sportIsHidden,
                                    categoryId,
                                    penaltyId,
                                    discounts: discountList?.map(
                                        (discountId) => ({ id: discountId })
                                    ),
                                };
                            } else {
                                return sport;
                            }
                        })
                    );
                }
                reset();
            }
        } catch (error) {
            setError((error as any).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitSport}
                className="text-center max-w-[20rem] min-w-[18rem] mx-auto"
            >
                <h1 className="w-full mb-8 text-3xl font-bold tracking-wider text-gray-600">
                    الرياضة
                </h1>

                <div className="z-30 flex items-center justify-between w-full p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <button
                        type="button"
                        className="flex gap-2 pl-2 mx-2 border-l-2 border-l-customGray-900 whitespace-nowrap"
                        onClick={reset}
                    >
                        جديد
                        <span className="font-bold text-customOrange-900">
                            +
                        </span>
                    </button>
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                sportsList ?? []
                            ) ?? []
                        }
                        onChange={handleSelectChange}
                        value={selectValue}
                        name="sport"
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
                        value={data.name ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-left">
                    <input
                        type="number"
                        name="price"
                        className="block w-full px-4 py-2 bg-gray-200 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 "
                        placeholder="السعر"
                        value={data.price ?? ""}
                        onChange={(e) => {
                            handleChange(e);
                            setError("");
                        }}
                    />
                </div>
                <div className="py-2 text-right">
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                categories ?? []
                            ) ?? []
                        }
                        value={categoryId ?? ""}
                        onChange={(e) => {
                            setCategoryId(e);
                            setError("");
                        }}
                        name="categoryId"
                    />
                </div>
                <div className="py-2 text-right">
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                penalties ?? []
                            ) ?? []
                        }
                        value={penaltyId ?? ""}
                        onChange={(e) => {
                            setPenaltyId(e);
                            setError("");
                        }}
                        name="penaltyId"
                    />
                </div>
                <div className="py-2 text-right">
                    <SingleSelect
                        options={
                            arrayToReactSelectOption(
                                "title",
                                "id",
                                discounts ?? []
                            ) ?? []
                        }
                        isMulti
                        value={discountList ?? ""}
                        onChange={(e) => {
                            setDiscountList(e);
                            setError("");
                        }}
                        name="discounts"
                        controlClassName="!rounded-3xl"
                    />
                </div>
                <div className="flex items-center gap-2 py-2">
                    <input
                        className="mt-2 accent-customOrange-900"
                        type="checkbox"
                        name="hidden"
                        checked={!sportIsHidden}
                        onChange={(e) => setSportIsHidden(!e.target.checked)}
                    />
                    <span className="">مفعل</span>
                </div>
                <div className="py-2">
                    <button
                        type="submit"
                        className="block w-full p-2 font-bold tracking-wider text-white bg-orange-500 border-2 border-gray-100 rounded-lg focus:outline-none focus:border-gray-700 hover:bg-orange-600"
                    >
                        {!data.id || data.id == null ? "تسجيل" : "تعديل"}
                    </button>
                </div>
            </form>
        </div>
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
                session.user.role !== Role.ADMIN)
        ) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
            };
        }
        const categories = await categoriesRepo.getAll();
        const sports = sportsRepo.getAll();
        const discounts = discountsRepo.getAll();
        const penalties = penaltiesRepo.getAll();
        const usersList = await usersRepo.getAll();
        const users = usersList
            ? session.user.role === Role.OWNER
                ? usersList.filter((x) => x.role !== Role.OWNER)
                : usersList.filter(
                      (x) => x.role !== Role.OWNER && x.role !== Role.ADMIN
                  )
            : null;
        return {
            props: {
                categories: categories ? categories : null,
                discounts: discounts ? discounts : null,
                penalties: penalties ? penalties : null,
                sports: sports ? sports : null,
                users: users ? users : null,
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
}

export default Edit;
