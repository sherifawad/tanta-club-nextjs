import {
    FromWeeks,
    Months,
    RangeInputType,
    ToWeeks,
    Years,
} from "@/pages/dashboard";
import isWithinInterval from "date-fns/isWithinInterval";
import parseISO from "date-fns/parseISO";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

type DateRangeProps = {
    onRangeSelect: ({ from, to }: RangeInputType) => void;
};

function DateRange({ onRangeSelect }: DateRangeProps) {
    const [fromDate, setFromDate] = useState({ week: 1, month: 0, year: 2023 });
    const [toDate, setToDate] = useState({ week: 7, month: 0, year: 2023 });
    const [showDate, setShowDate] = useState(false);

    const [isChanging, setIsChanging] = useState(false);
    const reset = useCallback(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() - 1;
        setFromDate((prev) => ({ ...prev, year, month }));
        setToDate((prev) => ({ ...prev, year, month }));
        setIsChanging(false);
        setShowDate(false);
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    const applyDateFilter = () => {
        setShowDate(true);
        onRangeSelect({
            from: new Date(
                fromDate.year,
                fromDate.month,
                fromDate.week
            ).toDateString(),
            to: new Date(toDate.year, toDate.month, toDate.week).toDateString(),
        });
    };

    return (
        <div className="flex flex-col gap-3 px-2 py-4 mx-auto item-center">
            <div className="flex flex-wrap items-end justify-center gap-4 ">
                <div className="flex flex-col items-center gap-4">
                    <label className="font-bold leading-tight text-black uppercase">
                        من
                    </label>
                    <div className="flex items-center flex-grow gap-2 p-2 bg-white rounded-full shadow shadow-customOrange-900">
                        <select
                            value={fromDate.week}
                            onChange={(e) => {
                                setFromDate((prev) => ({
                                    ...prev,
                                    week: +e.target.value,
                                }));

                                setIsChanging(true);
                            }}
                            className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-l-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                        >
                            {FromWeeks.map((w) => (
                                <option key={w.value} value={w.value}>
                                    {w.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={fromDate.month}
                            onChange={(e) => {
                                setFromDate((prev) => ({
                                    ...prev,
                                    month: +e.target.value,
                                }));

                                setIsChanging(true);
                            }}
                            className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                        >
                            {Months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={fromDate.year}
                            onChange={(e) => {
                                setFromDate((prev) => ({
                                    ...prev,
                                    year: +e.target.value,
                                }));

                                setIsChanging(true);
                            }}
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
                            value={toDate.week}
                            onChange={(e) => {
                                setToDate((prev) => ({
                                    ...prev,
                                    week: +e.target.value,
                                }));
                                setIsChanging(true);
                            }}
                            className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase rounded-full rounded-l-none bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                        >
                            {ToWeeks.map((w) => (
                                <option key={w.value} value={w.value}>
                                    {w.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={toDate.month}
                            onChange={(e) => {
                                setToDate((prev) => ({
                                    ...prev,
                                    month: +e.target.value,
                                }));
                                setIsChanging(true);
                            }}
                            className="px-1 py-4 text-xs font-bold leading-tight text-black uppercase bg-customGray-100 focus:outline-none focus:shadow-outline lg:text-sm"
                        >
                            {Months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                        <select
                            value={toDate.year}
                            onChange={(e) => {
                                setToDate((prev) => ({
                                    ...prev,
                                    year: +e.target.value,
                                }));
                                setIsChanging(true);
                            }}
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
                <div className="grid grid-cols-2 gap-4 place-items-center sm:place-items-start">
                    <button
                        className={`w-16 p-2 text-lg text-white ${
                            isChanging ? "bg-green-300" : "bg-gray-700"
                        }  rounded-lg hover:bg-green-600`}
                        onClick={applyDateFilter}
                    >
                        موافق
                    </button>
                    <button
                        onClick={reset}
                        className="w-16 p-2 text-lg text-white bg-pink-500 rounded-lg hover:bg-pink-600"
                    >
                        الغ
                    </button>
                </div>
            </div>
            {showDate && (
                <h1 className="flex items-center mx-auto text-orange-600">
                    <span className="text-lg font-bold">
                        {new Date(
                            fromDate.year,
                            fromDate.month,
                            fromDate.week
                        ).toLocaleDateString()}
                    </span>
                    <span className="text-3xl font-bold">~</span>
                    <span className="text-lg font-bold">
                        {new Date(
                            toDate.year,
                            toDate.month,
                            toDate.week
                        ).toLocaleDateString()}
                    </span>
                </h1>
            )}
        </div>
    );
}

export default DateRange;
