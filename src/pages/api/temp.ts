import { NextApiRequest, NextApiResponse } from "next";

import { promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "DELETE") {
            await fs.access(
                path.join(tmpdir(), "data", "categories.json"),
                fs.constants.F_OK
            );
            return res.status(500).send("");
        }
        return res.status(500).send("");
    } catch (err) {
        try {
            fs.mkdir(path.join(process.cwd(), "tmp"), { recursive: true });
            fs.cp("data", tmpdir(), { recursive: true });
            // If there was an error, Next.js will continue
            // to show the last successfully generated page
        } catch (error) {
            console.log("🚀 ~ file: temp.ts:26 ~ error:", error);
            return res.status(500).send("");
        }
    }
}
