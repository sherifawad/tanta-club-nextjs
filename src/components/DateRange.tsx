import isWithinInterval from "date-fns/isWithinInterval";
import parseISO from "date-fns/parseISO";
import { Dispatch, SetStateAction, useState } from "react";

type DateRangeProps = {
    setDate: Dispatch<
        SetStateAction<{
            from: Date | null;
            to: Date | null;
        }>
    >;
};
function DateRange({ setDate }: DateRangeProps) {
    const [value, setValue] = useState({
        from: "",
        to: "",
    });
    const [isChanging, setIsChanging] = useState(true);
    const [minDate, setMinDate] = useState(new Date().toString());
    const applyDateFilter = () => {
        if (!value.from) return;
        const from = parseISO(value.from);
        const to = parseISO(value.to ?? value.from);
        setIsChanging(false);
        setDate({ from, to });
    };

    return (
        <div className="grid grid-cols-1 gap-4 p-4 sm:flex sm:grid-cols-2 place-items-to">
            <div className="grid grid-cols-2 gap-4 my-1 sm:place-items-to">
                <div className="flex flex-col items-center">
                    <label>من</label>
                    <input
                        type="date"
                        className="bg-transparent"
                        value={value.from}
                        onChange={({ target: { value } }) => {
                            setValue({ from: value, to: "" });
                            setMinDate(value);
                            setIsChanging(true);
                        }}
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label>الى</label>
                    <input
                        type="date"
                        className="bg-transparent"
                        value={value.to}
                        onChange={({ target: { value } }) => {
                            setValue((prev) => ({ ...prev, to: value }));
                            setIsChanging(true);
                        }}
                        min={minDate}
                    />
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
                    className="w-16 p-2 text-lg text-white bg-pink-500 rounded-lg hover:bg-pink-600"
                    onClick={() => {
                        setValue({
                            from: "",
                            to: "",
                        });
                        setDate({
                            from: null,
                            to: null,
                        });
                    }}
                >
                    الغ
                </button>
            </div>
        </div>
    );
}

export default DateRange;
