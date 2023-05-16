import React, { Dispatch, SetStateAction, useState } from "react";

import Select, { Props, SingleValue } from "react-select";
import { Category, IReactSelectOption } from "types";

interface SelectCategoriesProps extends Props<any, any, any> {
    onChange?: (newValue: number) => void;
    options: IReactSelectOption[];
}

export default function SelectCategories({
    onChange,
    options,
}: SelectCategoriesProps) {
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
            name="category"
            defaultValue={options[0]}
            onChange={(newValue: SingleValue<IReactSelectOption>) =>
                newValue && onChange ? onChange(newValue.value) : undefined
            }
            options={options}
        />
    );
}
