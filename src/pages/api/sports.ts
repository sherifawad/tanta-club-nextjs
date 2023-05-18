import axios from "axios";
import { getCookie } from "cookies-next";
import { sportsRepo } from "lib/sports-repo";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { authOptions } from "./auth/[...nextauth]";

const secret = process.env.NEXTAUTH_SECRET;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.headers.appsecret === process.env.APP_SECRET) {
            const sports = sportsRepo.getAll();
            return res.status(200).send(sports);
        }
        return res.status(401).send("Unauthorized");
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error revalidating");
    }
}
