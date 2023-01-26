import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const sports = await prisma.sport.findMany({
			include: {
				Category: true,
				DiscountOptions: true,
			},
		});
		return res.status(200).send(sports);
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send("Error revalidating");
	}
}
