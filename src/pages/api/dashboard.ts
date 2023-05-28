import { dataPrismaRepo } from "@/lib/data-repo-prisma";
import { discountsPrismaRepo } from "@/lib/discounts-repo-prisma";
import { getCurrentUser } from "@/lib/session";
import { Discount, DiscountType, Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const {
                from,
                to,
                categoryId,
            }: { from: string; to: string; categoryId: number } = JSON.parse(
                req.body
            );
            if (!from || from.length < 8 || !to || to.length < 8)
                return res.status(402).json({
                    success: false,
                    error: true,
                    message: "invalid Method",
                });
            const { sports, error } = await dataPrismaRepo.getCategoryData({
                from,
                to,
                categoryId,
            });
            return res.status(201).json({
                success: error ? false : true,
                sports,
                error,
            });
        } else if (req.method === "PUT") {
            return res.status(200).json({
                success: true,
                message: "discount updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const discounts = (await discountsPrismaRepo.getAll()).filter(
                    (x) => x.enabled === true
                );
                return res.status(200).send(discounts);
            }
        }
        return res.status(401).send("Unauthorized");
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error revalidating");
    }
}
