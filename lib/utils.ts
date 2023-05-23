import path from "path";
import { IReactSelectOption } from "../types";
import {
    accessSync,
    constants,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from "fs";
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

// export const getBaseUrl = () => {
//     if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
//         return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
//     if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
//         return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
//     return "http://localhost:3000";
// };

export const getBaseUrl = () => {
    if (process.env.DEPLOY_ENV === "production")
        return `https://${process.env.DEPLOY_URL}`;
    if (process.env.DEPLOY_ENV === "staging ")
        return `https://${process.env.DEPLOY_URL}`;
    return "http://localhost:3000";
};

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
export function dataFolder(fileName: string) {
    const tempPath = path.join(tmpdir(), "data", fileName);
    const originalPath = path.join(process.cwd(), "data", fileName);
    try {
        createTempDirectory();
        accessSync(tempPath, constants.F_OK);
        return tempPath;
    } catch (error) {
        const data = JSON.parse(readFileSync(originalPath, "utf8"));
        writeFileSync(tempPath, JSON.stringify(data, null, 4), {
            encoding: "utf8",
            flag: "w",
        });
        return tempPath;
    }
}
function createTempDirectory() {
    try {
        accessSync(path.join(tmpdir(), "data"), constants.F_OK);
    } catch (error) {
        mkdirSync(path.join(tmpdir(), "data"), { recursive: true });
    }
}
