// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { setCookie } from "@/lib/cookies";
import type { NextApiRequest, NextApiResponse } from "next";
import { Queue, QueueStatus, Role } from "types";
import { getCurrentUser } from "@/lib/session";

type Data = {
    current: number;
    queue?: Queue;
    message?: string;
};

const queueList: Queue[] = [];
let current = 1;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        const { code, id, force } = req.body
            ? JSON.parse(req.body)
            : { code: undefined, id: undefined, force: false };
        if (code && code !== null) {
            const queue = queueList.findLast((x) => x.code === code);
            if (queue && queue.status !== QueueStatus.COMPLETED && !force) {
                return res.status(200).json({ queue: queue, current });
            }
            if (queue && queue.status === QueueStatus.COMPLETED && !force) {
                return res.status(200).json({ queue: queue, current });
            }

            const newQueue: Queue = {
                id: queueList.length
                    ? Math.max(...queueList.map((x) => x.id)) + 1
                    : 1,
                code: code,
                status: QueueStatus.PENDING,
            };
            queueList.push(newQueue);
            setCookie(res, "QUEUE", JSON.stringify(newQueue), {
                path: "/queue",
                maxAge: 2592000,
            });

            // Return the `set-cookie` header so we can display it in the browser and show that it works!
            // res.end(res.getHeader("Set-Cookie")).status(200).json({ queue });
            return res.status(200).json({ queue: newQueue, current });
        } else if (id && id !== null) {
            const queue = queueList.find((x) => x.id == id);
            setCookie(res, "QUEUE", JSON.stringify(queue), {
                path: "/queue",
                maxAge: 2592000,
            });
            return res.status(200).json({ queue, current });
        }
        return res.status(200).json({
            current,
            queue: queueList.findLast((x) => x.id === current),
        });
    } else if (req.method === "PUT") {
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
        const { id, status } = req.body
            ? JSON.parse(req.body)
            : { id: undefined, status: QueueStatus };
        if (!id || id === null || !status || status === null) {
            return res.status(200).json({
                current,
                queue: queueList.findLast((x) => x.id === current),
            });
        }
        current = current + 1;
        const queueIndex = queueList.findLastIndex((x) => x.id === id);
        if (queueIndex < 0) {
            return res.status(200).json({
                current,
                queue: queueList.findLast((x) => x.id === current),
            });
        }

        queueList[queueIndex].status = status;

        return res.status(200).json({
            current,
            queue: queueList.findLast((x) => x.id === current),
        });
    } else {
        // Handle any other HTTP method

        res.status(200).json({ current });
    }
}
