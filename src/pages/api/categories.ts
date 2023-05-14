import { categoriesRepo } from "lib/categories-repo";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.headers.appsecret === process.env.APP_SECRET) {
            const categories = categoriesRepo
                .getAll()
                .filter((x) => x.hidden === false);
            return res.status(200).send(categories);
        }
        return res.status(401).send("Unauthorized");
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error revalidating");
    }
}
