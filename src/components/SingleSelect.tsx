import React, { Dispatch, SetStateAction, useState } from "react";

import Select, { Props, SingleValue } from "react-select";
import { IReactSelectOption } from "types";

interface SingleSelectProps extends Props<any, any, any> {
    onChange?: (newValue: number) => void;
    options: IReactSelectOption[];
    name: string;
    setDefaultValue?: boolean;
}

export default function SingleSelect({
    onChange,
    options,
    name,
    setDefaultValue = false,
}: SingleSelectProps) {
    return (
        <Select
            classNames={{
                control: () =>
                    "flex !shadow-none !border !rounded-full gap-x-2 !bg-customGray-100 !text-black font-semibold  !border-customGray-100 ",
                container: () => "w-full",
            }}
            isDisabled={false}
            isLoading={false}
            isClearable={true}
            isRtl={true}
            isSearchable={true}
            name={name}
            defaultValue={setDefaultValue ? options[0] : null}
            onChange={(newValue: SingleValue<IReactSelectOption>) =>
                newValue && onChange ? onChange(newValue.value) : undefined
            }
            options={options}
        />
    );
}
