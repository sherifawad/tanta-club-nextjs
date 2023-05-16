import Cookies, { serialize, CookieSerializeOptions, parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * This sets `cookie` using the `res` object
 */
export const setCookie = (
    res: NextApiResponse,
    name: string,
    value: unknown,
    options: CookieSerializeOptions = {}
) => {
    const stringValue =
        typeof value === "object"
            ? "j:" + JSON.stringify(value)
            : String(value);

    if (typeof options.maxAge === "number") {
        options.expires = new Date(Date.now() + options.maxAge * 1000);
    }

    res.setHeader("Set-Cookie", serialize(name, stringValue, options));
};

export function parseCookies(req: NextApiRequest | undefined = undefined) {
    return parse(req?.headers.cookie || "");
}

export function deleteCookies(name: string, res: NextApiResponse) {
    res.setHeader("Set-Cookie", serialize(name, ""));
}
