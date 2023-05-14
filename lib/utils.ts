import { IReactSelectOption } from "../types";

export const isArray = function (a: unknown) {
    return Array.isArray(a);
};

export const isObject = function (o: unknown) {
    return o === Object(o) && !isArray(o) && typeof o !== "function";
};

export function isIterable(variable: unknown) {
    return isArray(variable) || isObject(variable);
}

export function serialize(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export const arrayToReactSelectOption = (
    labelKey: string,
    valueKey: string,
    array: any[]
): IReactSelectOption[] | undefined => {
    if (!array || array.length < 1) return undefined;
    if (!(labelKey in array[0]) || !(valueKey in array[0])) return undefined;
    return array.map((obj) =>
        Object.entries(obj).reduce(
            (acc, [key, objValue]) => {
                if (key === labelKey) {
                    acc = { ...acc, label: objValue as string };
                } else if (key === valueKey) {
                    acc = { ...acc, value: objValue };
                }
                return acc;
            },
            { label: "", value: "" as any }
        )
    );
};