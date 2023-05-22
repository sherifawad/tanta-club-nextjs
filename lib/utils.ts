import path from "path";
import { IReactSelectOption } from "../types";
import { accessSync, constants, mkdirSync } from "fs";
import { tmpdir } from "os";

export const stringTrim = (str: string): string =>
    str.replace(/\s\s+/g, " ").trim();

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

export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return "http://localhost:3000";
};

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
export function dataFolder() {
    try {
        accessSync(path.join(tmpdir(), "data"), constants.F_OK);
        console.log("🚀 ~ file: utils.ts:63 ~ dataFolder ~ temp:");
        return path.join(tmpdir(), "data");
    } catch (error) {
        console.log("🚀 ~ file: utils.ts:63 ~ dataFolder ~ error:", error);
        mkdirSync(path.join(tmpdir(), "data"), { recursive: true });
        return path.join(process.cwd(), "data");
    }
}
