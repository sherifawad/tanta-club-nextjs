import { compare, hash } from "bcryptjs";
import { NextApiRequest } from "next";
import { Session } from "next-auth";
import { parseCookies } from "./cookies";

export async function hashPassword(password: string) {
    const hashedPassword = await hash(password, 12);
    return hashedPassword;
}

export async function isPasswordValid(
    password: string,
    hashedPassword: string
) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}

export async function getSession(req: NextApiRequest): Promise<Session> {
    const cookie = parseCookies(req);
    console.log("🚀 ~ file: hash.ts:21 ~ getSession ~ cookie:", cookie);
    const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/auth/session`
    );
    const session = await response.json();
    console.log("🚀 ~ file: hash.ts:24 ~ getSession ~ session:", session);

    return Object.keys(session).length > 0 ? session : null;
}
