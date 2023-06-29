import { aggregatedData } from "@/lib/data-repo-prisma";
import { ConvertToLocalDateString, getBaseUrl } from "@/lib/utils";
import {
    FromWeeks,
    Months,
    RangeInputType,
    ToWeeks,
    Years,
} from "@/pages/dashboard";
import { Category } from "@prisma/client";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { RangeInput, dateInput } from "types";

type DateRangeProps = {
    date: RangeInput;
    onChangeTo: (e: ChangeEvent<HTMLSelectElement>) => void;
    onChangeFrom: (e: ChangeEvent<HTMLSelectElement>) => void;
};

function DateRange({ date, onChangeTo, onChangeFrom }: DateRangeProps) {
    return (
        <div className="flex flex-wrap items-end justify-center gap-4 ">
            <div className="flex flex-col items-center gap-4">
                <label className="font-bold leading-tight text-black uppercase">
                    من
                </label>
                <div className="flex items-center flex-grow gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <select
                        value={date.from.week}
                        name="week"
                        onChange={onChangeFrom}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-l-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {FromWeeks.map((w) => (
                            <option key={w.value} value={w.value}>
                                {w.title}
                            </option>
                        ))}
                    </select>
                    <select
                        value={date.from.month}
                        name="month"
                        onChange={onChangeFrom}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {Months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.title}
                            </option>
                        ))}
                    </select>
                    <select
                        value={date.from.year}
                        name="year"
                        onChange={onChangeFrom}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-r-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {Years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <label className="font-bold leading-tight text-black uppercase">
                    الى
                </label>
                <div className="flex items-center flex-grow gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                    <select
                        value={date.to.week}
                        name="week"
                        onChange={onChangeTo}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-l-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {ToWeeks.map((w) => (
                            <option key={w.value} value={w.value}>
                                {w.title}
                            </option>
                        ))}
                    </select>
                    <select
                        value={date.to.month}
                        name="month"
                        onChange={onChangeTo}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {Months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.title}
                            </option>
                        ))}
                    </select>
                    <select
                        value={date.to.year}
                        name="year"
                        onChange={onChangeTo}
                        className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-r-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                    >
                        {Years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

const FilterButtons = ({
    add,
    remove,
}: {
    add: () => void;
    remove: (index?: number) => void;
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 pb-4 place-items-center place-content-center sm:place-items-start">
            <button
                className={`w-8 p-1 text-lg text-white bg-green-600 rounded-lg hover:bg-green-300`}
                onClick={add}
            >
                +
            </button>
            <button
                className="w-8 p-1 text-lg text-white bg-pink-500 rounded-lg hover:bg-pink-600"
                onClick={() => remove()}
            >
                -
            </button>
        </div>
    );
};

type FilterPopUpProps = {
    category: Category | null;
};

type FilterData = aggregatedData & {
    range: string;
};

const FilterPopUp = ({ category }: FilterPopUpProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const [dateList, setDateList] = useState<RangeInput[]>([]);
    const [filterResult, setFilterResult] = useState<FilterData[]>([]);
    const [date, setdate] = useState<RangeInput>({
        from: { week: 1, month: 0, year: 2023 },
        to: { week: 7, month: 0, year: 2023 },
    });
    const reset = useCallback(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        setdate((prev) => ({
            from: { ...prev.from, year, month },
            to: { ...prev.to, year, month },
        }));
        setDateList([
            {
                from: { week: 1, year, month },
                to: { week: 7, year, month },
            },
        ]);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const addDate = useCallback(() => {
        setDateList((prev) => [...prev, date]);
    }, [date]);

    const removeDate = useCallback((index: number) => {
        setDateList((prev) => {
            return prev.length === 1
                ? prev
                : prev.filter((_item, itemIndex) => itemIndex != index);
        });
    }, []);

    const onChangeTo = useCallback(
        (e: ChangeEvent<HTMLSelectElement>, index?: number) => {
            setDateList((prev) => {
                return prev.map((item, itemIndex) => {
                    if (itemIndex === index) {
                        return {
                            ...item,
                            to: {
                                ...item.to,
                                [e.target.name]: +e.target.value,
                            },
                        };
                    }
                    return item;
                });
            });
        },
        []
    );
    const onChangeFrom = useCallback(
        (e: ChangeEvent<HTMLSelectElement>, index?: number) => {
            setDateList((prev) => {
                return prev.map((item, itemIndex) => {
                    if (itemIndex === index) {
                        return {
                            ...item,
                            from: {
                                ...item.from,
                                [e.target.name]: +e.target.value,
                            },
                        };
                    }
                    return item;
                });
            });
        },
        []
    );

    const onRangeSelect = async () => {
        try {
            if (isLoading) return;
            setIsLoading(true);
            setFilterResult([]);
            // const fromDate = ConvertToLocalDate(dateList[0].from);
            // const toDate = ConvertToLocalDate(dateList[0].to);
            // const response = await fetch(
            //     `${getBaseUrl()}/api/dashboard?from=${fromDate}&to=${toDate}&categoryId=${
            //         category?.id
            //     }`,
            //     {
            //         method: "GET",
            //         credentials: "include",
            //     }
            // );

            // const {
            //     sports,
            //     success,
            // }: {
            //     success: boolean;
            //     sports: aggregatedData[] | null;
            // } = await response.json();
            // console.log(
            //     "🚀 ~ file: FilterPopUp.tsx:257 ~ onRangeSelect ~ sports:",
            //     sports
            // );

            Promise.all(
                dateList.map((u) => {
                    const fromDate = ConvertToLocalDateString(u.from);
                    const toDate = ConvertToLocalDateString(u.to);
                    return fetch(
                        `${getBaseUrl()}/api/dashboard?from=${fromDate}&to=${toDate}&categoryId=${
                            category?.id
                        }`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );
                })
            )
                .then((responses) =>
                    Promise.all(responses.map((res) => res.json()))
                )
                .then((results) => {
                    results.forEach((r) => {
                        const { sports, range, success, error } = r;

                        if (error) {
                            throw new Error(error);
                        }

                        const fromString = new Date(
                            range.from
                        ).toLocaleDateString();
                        const toString = new Date(
                            range.to
                        ).toLocaleDateString();
                        const sportsData = sports.map((sp: aggregatedData) => {
                            return {
                                ...sp,
                                range: `${fromString}-${toString}`,
                            };
                        });

                        setFilterResult((prev) => [...prev, ...sportsData]);
                    });
                })
                .catch((error) => {
                    console.log(
                        "🚀 ~ file: FilterPopUp.tsx:295 ~ onRangeSelect ~ error:",
                        error
                    );
                });
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="">
                {dateList.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-wrap items-end justify-center gap-4 pb-4"
                    >
                        <DateRange
                            date={item}
                            onChangeTo={(e) => onChangeTo(e, index)}
                            onChangeFrom={(e) => onChangeFrom(e, index)}
                        />
                        <div className="grid grid-cols-2 gap-4 pb-4 place-items-center place-content-center sm:place-items-start">
                            {index != 0 && (
                                <button
                                    className="w-8 p-1 text-lg text-white bg-pink-500 rounded-lg hover:bg-pink-600"
                                    onClick={() => removeDate(index)}
                                >
                                    -
                                </button>
                            )}

                            {index === dateList.length - 1 && (
                                <button
                                    className={`w-8 p-1 text-lg text-white bg-green-600 rounded-lg hover:bg-green-300`}
                                    onClick={addDate}
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center">
                <button
                    className={`p-2 text-lg text-white bg-orange-400 rounded-lg`}
                    onClick={onRangeSelect}
                >
                    موافق
                </button>
            </div>
            <div className="">
                <pre>
                    <code>{JSON.stringify(filterResult, null, 2)}</code>
                </pre>
            </div>
        </div>
    );
};

export default FilterPopUp;
