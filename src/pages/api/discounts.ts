import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.headers.appsecret === process.env.APP_SECRET) {
			const discounts = await prisma.discount.findMany();
			return res.status(200).send(discounts);
		}
		return res.status(401).send("Unauthorized");
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send("Error revalidating");
	}
}
