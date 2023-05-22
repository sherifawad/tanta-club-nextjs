import { getCurrentUser } from "@/lib/session";
import { discountsRepo } from "lib/discounts-repo";
import type { NextApiRequest, NextApiResponse } from "next";
import { Discount, DiscountType, Role } from "types";

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
            const discountExist = await discountsRepo.find(
                (x) => x.name === name
            );
            if (discountExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    discountExist: true,
                });
            }
            // Store new discount
            const storeDiscount = await discountsRepo.create({
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            } as Discount);

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

            const discountExist = await discountsRepo.getById(id);
            if (!discountExist) {
                return res.status(422).json({
                    success: false,
                    message: "No user exists!",
                });
            }
            const discountNameExist = await discountsRepo.find(
                (x) => x.name === name
            );
            if (discountNameExist && discountNameExist.id !== id) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    discountExist: true,
                });
            }
            await discountsRepo.update(id, {
                name,
                title,
                type,
                minimum,
                Maximum,
                step,
                enabled,
            } as Discount);

            return res.status(200).json({
                success: true,
                message: "discount updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const discounts = await discountsRepo.getAll();
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
