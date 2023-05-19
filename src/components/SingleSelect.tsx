import Select, { MultiValue, Props, SingleValue } from "react-select";
import { IReactSelectOption } from "types";

interface SingleSelectProps extends Props<any, any, any> {
    onChange?: (newValue: any) => void;
    options: IReactSelectOption[];
    name: string;
    setDefaultValue?: boolean;
    isClearable?: boolean;
    isMulti?: boolean;
    value: any;
    containerClassName?: string;
    controlClassName?: string;
}

export default function SingleSelect({
    onChange,
    options,
    name,
    setDefaultValue = false,
    value,
    isClearable = false,
    isMulti = false,
    containerClassName = "",
    controlClassName = "",
}: SingleSelectProps) {
    return (
        <Select
            classNames={{
                control: () =>
                    `flex !shadow-none !border !rounded-full gap-x-2 !bg-customGray-100 !text-black font-semibold  !border-customGray-100 ${controlClassName}`,
                container: () => "w-full",
                valueContainer: () => `${containerClassName}`,
            }}
            isDisabled={false}
            isLoading={false}
            isClearable={isClearable}
            isRtl={true}
            isSearchable={true}
            name={name}
            isMulti={isMulti}
            value={
                isMulti
                    ? options.filter((option) =>
                          Array.from(value ?? []).some(
                              (val) => option.value === val
                          )
                      ) || null
                    : options.find((x) => x.value === value) || null
            }
            defaultValue={setDefaultValue ? options[0] : null}
            onChange={(newValue) =>
                newValue && onChange
                    ? onChange(
                          isMulti
                              ? (newValue as IReactSelectOption[]).map(
                                    (v) => v.value
                                )
                              : (newValue as IReactSelectOption).value
                      )
                    : undefined
            }
            options={options}
        />
    );
}
