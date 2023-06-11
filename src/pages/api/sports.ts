import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/lib/session";
import { Role, type Sport } from "@prisma/client";
import {
    sportsPrismaRepo,
    type SportToEditType,
} from "@/lib/sports-repo-prisma";

const secret = process.env.NEXTAUTH_SECRET;
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const newSport = req.body;
            if (!newSport || newSport == null)
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            const {
                name,
                title,
                price,
                hidden,
                categoryId,
                penaltyId,
                discounts,
            }: SportToEditType = JSON.parse(newSport);

            if (
                !name ||
                name.length < 0 ||
                !title ||
                title.length < 0 ||
                !categoryId ||
                !price ||
                price === 0
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
            const sportExist = await sportsPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (sportExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    sportExist: true,
                });
            }
            // Store new discount
            const storeSport = await sportsPrismaRepo.create({
                name,
                title,
                price,
                hidden,
                categoryId,
                penaltyId,
                discounts,
            } as SportToEditType);

            return res.status(201).json({
                success: true,
                message: "discount created successfully",
                storeSport,
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
                price,
                hidden,
                categoryId,
                penaltyId,
                discounts,
            }: SportToEditType = JSON.parse(req.body);

            const sportExist = await sportsPrismaRepo.getById(id);
            if (!sportExist) {
                return res.status(422).json({
                    success: false,
                    message: "No user exists!",
                });
            }
            const sportNameExist = await sportsPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (sportNameExist && sportNameExist.id !== id) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    sportExist: true,
                });
            }
            await sportsPrismaRepo.update(id, {
                name,
                title,
                price: +price,
                hidden,
                categoryId,
                penaltyId,
                discounts,
            } as SportToEditType);

            return res.status(200).json({
                success: true,
                message: "discount updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const sports = (await sportsPrismaRepo.getAll()).filter(
                    (x) => x.hidden === false
                );
                return res.status(200).send(sports);
            }
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error revalidating");
    }
}
