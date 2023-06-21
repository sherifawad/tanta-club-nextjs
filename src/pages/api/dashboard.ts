import { dataPrismaRepo } from "@/lib/data-repo-prisma";
import { discountsPrismaRepo } from "@/lib/discounts-repo-prisma";
import { getCurrentUser } from "@/lib/session";
import { Discount, DiscountType, Role } from "@prisma/client";
import { error } from "console";
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
                sportId,
                totalRecites,
                totalPrice,
            }: {
                from: string;
                to: string;
                sportId: number;
                totalRecites: number;
                totalPrice: number;
            } = JSON.parse(req.body);
            if (
                !from ||
                from.length < 8 ||
                !to ||
                to.length < 8 ||
                !totalRecites ||
                totalRecites < 1 ||
                !totalPrice ||
                totalPrice < 1
            )
                return res.status(402).json({
                    success: false,
                    error: true,
                    message: "invalid Method",
                });
            const user = await getCurrentUser({ req, res });
            if (!user || user == null) {
                return res.status(401).send({
                    message:
                        "You must be signed in to view the protected content on this page.",
                });
            }
            if (user.role !== Role.ADMIN && user.role !== Role.OWNER) {
                return res.status(401).send({
                    message: "Un-Authorized",
                });
            }
            const { error } = await dataPrismaRepo.create({
                from,
                to,
                sport: {
                    connect: {
                        id: sportId,
                    },
                },
                totalNumber: totalRecites,
                totalPrice,
            });
            return res.status(201).json({
                success: error ? false : true,
                message: error,
            });
        } else if (req.method === "PUT") {
            const {
                from,
                to,
                sportId,
                totalRecites,
                totalPrice,
            }: {
                from: string;
                to: string;
                sportId: number;
                totalRecites: number;
                totalPrice: number;
            } = JSON.parse(req.body);
            if (
                !from ||
                from.length < 8 ||
                !to ||
                to.length < 8 ||
                !totalRecites ||
                totalRecites < 1 ||
                !totalPrice ||
                totalPrice < 1
            )
                return res.status(402).json({
                    success: false,
                    error: true,
                    message: "invalid Method",
                });
            const user = await getCurrentUser({ req, res });
            if (!user || user == null) {
                return res.status(401).send({
                    message:
                        "You must be signed in to view the protected content on this page.",
                });
            }
            if (user.role !== Role.ADMIN && user.role !== Role.OWNER) {
                return res.status(401).send({
                    message: "Un-Authorized",
                });
            }
            const { error } = await dataPrismaRepo.update(
                { from, to, sportId },
                {
                    totalNumber: totalRecites,
                    totalPrice,
                }
            );
            return res.status(200).json({
                success: error ? false : true,
                message: error,
            });
        } else {
            const query = req.query;
            const { from, to, categoryId } = query;
            console.log("🚀 ~ file: dashboard.ts:124 ~ to:", to);
            console.log("🚀 ~ file: dashboard.ts:124 ~ from:", from);
            if (!from || from.length < 8 || !to || to.length < 8)
                return res.status(402).json({
                    success: false,
                    error: true,
                    message: "invalid Method",
                });
            const user = await getCurrentUser({ req, res });
            if (!user || user == null) {
                return res.status(401).send({
                    message:
                        "You must be signed in to view the protected content on this page.",
                });
            }
            if (
                user.role !== Role.ADMIN &&
                user.role !== Role.OWNER &&
                user.role !== Role.DASHBOARD
            ) {
                return res.status(401).send({
                    message: "Un-Authorized",
                });
            }
            const { sports, error } = await dataPrismaRepo.getCategoryData({
                from: from as string,
                to: to as string,
                categoryId: categoryId ? +categoryId : undefined,
            });
            return res.status(201).json({
                success: error ? false : true,
                sports,
                error,
            });
        }
        return res.status(401).send("Unauthorized");
    } catch (error) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).json({
            success: false,
            sports: [],
            error: (error as any).message,
        });
    }
}
