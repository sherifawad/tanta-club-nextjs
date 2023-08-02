// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { setCookie } from "@/lib/cookies";
import type { NextApiRequest, NextApiResponse } from "next";
import { Queue, QueueStatus, Role } from "types";
import { getCurrentUser } from "@/lib/session";

type Data = {
    current: number;
    queue?: Queue;
    message?: string;
    isStopped?: boolean;
};

const queueList: Queue[] = [];
let current = 1;
let isStopped = false;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const user = await getCurrentUser({ req, res });
        if (!user || user == null) {
            return res.status(401).send({
                current,
                message:
                    "You must be signed in to view the protected content on this page.",
            });
        }
        if (user.role === Role.CLIENT) {
            return res.status(401).send({
                current,
                message: "Un-Authorized",
            });
        }
        const { number } = req.body
            ? JSON.parse(req.body)
            : { number: undefined };

        current = number ?? current;

        return res.status(200).json({
            current,
        });
    } else {
        // Handle any other HTTP method

        res.status(200).json({ current });
    }
}
