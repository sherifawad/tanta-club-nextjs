import { discountsPrismaRepo } from "@/lib/discounts-repo-prisma";
import { getCurrentUser } from "@/lib/session";
import { DiscountType, type Discount, Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const newDiscount = req.body;
            if (!newDiscount || newDiscount == null)
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            const {
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            }: Discount = JSON.parse(newDiscount);

            if (
                !name ||
                name.length < 0 ||
                !title ||
                title.length < 0 ||
                !type ||
                !(type in DiscountType) ||
                type.length < 0 ||
                minimum === 0 ||
                Maximum === 0
            ) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            }
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
            // Check if discount exists
            const discountExist = await discountsPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (discountExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    discountExist: true,
                });
            }
            // Store new discount
            const storeDiscount = await discountsPrismaRepo.create({
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            });

            return res.status(201).json({
                success: true,
                message: "discount created successfully",
                storeDiscount,
            });
        } else if (req.method === "PUT") {
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

            const {
                id,
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            }: Discount = JSON.parse(req.body);

            const discountExist = await discountsPrismaRepo.getById(id);
            if (!discountExist) {
                return res.status(422).json({
                    success: false,
                    message: "No user exists!",
                });
            }
            const discountNameExist = await discountsPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (discountNameExist && discountNameExist.id !== id) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    discountExist: true,
                });
            }
            await discountsPrismaRepo.update(id, {
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            });

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
