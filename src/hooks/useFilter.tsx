import { OptionsValuesList } from "@/constants";
import { IReactSelectOption } from "@/types";
import { convertListStringToUrlString } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    FormEvent,
    ReactNode,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

const useFilter = ({
    filterList = [],
    buttonRef = null,
}: {
    filterList: IReactSelectOption[];
    buttonRef: RefObject<HTMLButtonElement> | null;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDisclosure = useCallback(() => {
        if (!buttonRef?.current) return;
        buttonRef.current.click();
        setFilterValue(undefined);
    }, [buttonRef]);

    const [filterName, setFilterName] = useState<
        IReactSelectOption | undefined
    >(undefined);
    const [filterOperator, setFilterOperator] = useState<
        IReactSelectOption | undefined
    >(undefined);
    const [inputName, setInputName] = useState<string | undefined>(undefined);
    const [filterValue, setFilterValue] = useState<string[] | undefined>(
        undefined
    );

    const [filterListString, setFilterListString] = useState<string[]>([]);

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (filterOperator?.value == null) return;

            if (filterValue == null) return;

            if (filterName?.value == null) return;

            const result =
                "name" +
                "=" +
                filterName?.value.toString() +
                "&" +
                "operator" +
                "=" +
                filterOperator?.value.toString() +
                "&" +
                "value" +
                "=" +
                convertListStringToUrlString(filterValue);

            const params = new URLSearchParams(searchParams).toString();
            router.push(pathname + "?" + result + "&" + params);
            toggleDisclosure();
            setFilterName(undefined);
            setFilterValue(undefined);
            setFilterOperator(undefined);
            setInputName(undefined);
        },
        [
            filterName?.value,
            filterOperator,
            filterValue,
            pathname,
            router,
            searchParams,
            toggleDisclosure,
        ]
    );

    const handelDelete = useCallback(
        (value: string) => {
            if (filterListString == null) return;

            const newFilters = filterListString.filter((x) => x !== value);

            let stringUrlQuery = "";
            newFilters.forEach((item, index) => {
                const [first, second, third, fourth, ...rest] = item.split(" ");
                let name: string, operator: string, value: string;
                if (OptionsValuesList.find((x) => x.label === second)) {
                    operator =
                        OptionsValuesList.find((x) => x.label === second)
                            ?.value ?? "";
                    name =
                        filterList.find((x) => x.label === first)?.value ?? "";
                    value = third + fourth || "" + rest || "";
                } else if (OptionsValuesList.find((x) => x.label === third)) {
                    operator =
                        OptionsValuesList.find((x) => x.label === third)
                            ?.value ?? "";
                    name =
                        filterList.find((x) => x.label === first + " " + second)
                            ?.value ?? "";
                    value = fourth + rest || "";
                } else if (
                    OptionsValuesList.find(
                        (x) => x.label === second + " " + third
                    )
                ) {
                    operator =
                        OptionsValuesList.find(
                            (x) => x.label === second + " " + third
                        )?.value ?? "";
                    name =
                        filterList.find((x) => x.label === first)?.value ?? "";
                    value = fourth + rest || "";
                } else if (
                    OptionsValuesList.find(
                        (x) => x.label === third + " " + fourth
                    )
                ) {
                    operator =
                        OptionsValuesList.find(
                            (x) => x.label === third + " " + fourth
                        )?.value ?? "";
                    name =
                        filterList.find((x) => x.label === first + " " + second)
                            ?.value ?? "";
                    value = convertListStringToUrlString(rest) || "";
                } else {
                    operator =
                        OptionsValuesList.find((x) => x.label === fourth)
                            ?.value ?? "";
                    name =
                        filterList.find(
                            (x) =>
                                x.label === first + " " + second + " " + third
                        )?.value ?? "";
                    value = convertListStringToUrlString(rest);
                }

                stringUrlQuery +=
                    "name" +
                    "=" +
                    name +
                    "&" +
                    "operator" +
                    "=" +
                    operator +
                    "&" +
                    "value" +
                    "=" +
                    value +
                    (index === newFilters.length - 1 ? "" : "&");
            });

            router.push(pathname + "?" + stringUrlQuery);
        },
        [filterList, filterListString, pathname, router]
    );

    useEffect(() => {
        setFilterListString([]);
        const nameArray = searchParams.getAll("name");
        const operatorArray = searchParams.getAll("operator");
        const valueArray = searchParams.getAll("value");

        for (let i = 0; i < nameArray.length; i++) {
            setFilterListString((prev) => [
                ...prev,
                filterList.find((x) => x.value === nameArray[i])?.label +
                    " " +
                    OptionsValuesList.find((x) => x.value === operatorArray[i])
                        ?.label +
                    " " +
                    valueArray[i],
            ]);
        }
    }, [filterList, searchParams]);

    const Filter = useMemo(() => {
        return function Filter({ children }: { children: ReactNode }) {
            return (
                <div className="z-50 flex items-end justify-center w-full max-w-md gap-2 p-2 mx-auto">
                    <ul className="flex flex-wrap self-start gap-2">
                        {filterListString?.map((value, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between flex-1 p-1 bg-gray-300 rounded-md whitespace-nowrap"
                            >
                                <p className="flex-1 px-1">{value}</p>
                                <span
                                    className="p-1 text-red-400 cursor-pointer"
                                    onClick={() => handelDelete(value)}
                                >
                                    X
                                </span>
                            </li>
                        ))}
                    </ul>

                    {children}
                </div>
            );
        };
    }, [filterListString, handelDelete]);

    const modelProps = useMemo(() => {
        return {
            filterName,
            setFilterName,
            filterOperator,
            setFilterOperator,
            inputName,
            setInputName,
            filterValue,
            setFilterValue,
            filterListString,
            setFilterListString,
            handleSubmit,
            toggleDisclosure,
            searchParams,
        };
    }, [
        filterListString,
        filterName,
        filterOperator,
        filterValue,
        handleSubmit,
        inputName,
        searchParams,
        toggleDisclosure,
    ]);

    return {
        Filter,
        modelProps,
    };
};

export default useFilter;
