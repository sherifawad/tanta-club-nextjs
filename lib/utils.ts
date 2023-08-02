import path from "path";
import { IReactSelectOption, dateInput } from "../types";
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

export const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production")
        return "https://clubsport.vercel.app";
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview")
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return "http://localhost:3000";
};

// export const getBaseUrl = () => {
//     return `https://${
//         process.env.NEXT_PUBLIC_VERCEL_URL ??
//         "stage--endearing-croquembouche-bd79b8.netlify.app"
//     }`;
//     switch (process.env.CONTEXT) {
//         case "production":
//             return `https://${process.env.NEXT_PUBLIC_URL ?? ""}`;
//         case "deploy-preview":
//             return `https://${process.env.NEXT_PUBLIC_DEPLOY_URL ?? ""}`;
//         case "branch-deploy":
//             return `https://${process.env.NEXT_PUBLIC_DEPLOY_PRIME_URL ?? ""}`;
//         default:
//             return `https://${process.env.NEXT_PUBLIC_DEPLOY_URL ?? ""}`;
//     }
// };

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}
export function dataFolder(fileName: string) {
    return path.join(process.cwd(), "data", fileName);
    // const tempPath = path.join(tmpdir(), "data", fileName);
    // try {
    //     createTempDirectory();
    //     accessSync(tempPath, constants.F_OK);
    //     return tempPath;
    // } catch (error) {
    //     const data = JSON.parse(readFileSync(originalPath, "utf8"));
    //     writeFileSync(tempPath, JSON.stringify(data, null, 4), {
    //         encoding: "utf8",
    //         flag: "w",
    //     });
    //     return tempPath;
    // }
}
function createTempDirectory() {
    try {
        accessSync(path.join(tmpdir(), "data"), constants.F_OK);
    } catch (error) {
        mkdirSync(path.join(tmpdir(), "data"), { recursive: true });
    }
}

export const ConvertToArabicNumbers = (num: number) => {
    const arabicNumbers =
        "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
    return new String(num).replace(/[0123456789]/g, (d) => {
        return arabicNumbers[d as any];
    });
};

export const ConvertToLocalDateString = (input: dateInput) => {
    const weeks = input.week;
    if (weeks === 31) {
        const lastDateOfTheMonth = new Date(
            input.year,
            input.month + 1,
            0
        ).getDate();

        return new Date(
            input.year,
            input.month,
            lastDateOfTheMonth
        ).toLocaleDateString();
    }
    return new Date(input.year, input.month, input.week).toLocaleDateString();
};
export const ConvertToISODateString = (input: dateInput) => {
    const weeks = input.week;
    if (weeks === 31) {
        const lastDateOfTheMonth = new Date(
            input.year,
            input.month + 1,
            0
        ).getDate();

        return new Date(
            input.year,
            input.month,
            lastDateOfTheMonth
        ).toISOString();
    }
    return new Date(input.year, input.month, input.week).toISOString();
};
export const ConvertToDate = (inputDateString: string) => {
    var parts = inputDateString.split("/");
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    return new Date(+parts[2], +parts[1] - 1, +parts[0] + 1);
};
