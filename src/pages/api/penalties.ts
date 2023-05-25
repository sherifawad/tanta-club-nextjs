import { getCurrentUser } from "@/lib/session";
import {
    DiscountType,
    Role,
    RepetitionType,
    type Penalty,
} from "@prisma/client";
import { penaltiesPrismaRepo } from "lib/penalties-repo-prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const newPenalty = req.body;
            if (!newPenalty || newPenalty == null)
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            const {
                name,
                title,
                type,
                repeated,
                minimum,
                Maximum,
                step,
                enabled,
                start,
                end,
            }: Penalty = JSON.parse(newPenalty);

            if (
                !name ||
                name.length < 0 ||
                !title ||
                title.length < 0 ||
                !repeated ||
                !(repeated in RepetitionType) ||
                repeated.length < 0 ||
                !type ||
                !(type in DiscountType) ||
                type.length < 0 ||
                minimum === 0 ||
                Maximum === 0 ||
                start === 0
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
            // Check if penalty exists
            const penaltyExist = await penaltiesPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (penaltyExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    penaltyExist: true,
                });
            }
            // Store new penalty
            const storePenalty = await penaltiesPrismaRepo.create({
                name,
                title,
                type,
                repeated,
                minimum,
                Maximum,
                step,
                enabled,
                start,
                end,
            });

            return res.status(201).json({
                success: true,
                message: "penalty created successfully",
                storePenalty,
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
                repeated,
                minimum,
                Maximum,
                step,
                enabled,
                start,
                end,
            }: Penalty = JSON.parse(req.body);

            const penaltyExist = await penaltiesPrismaRepo.getById(id);
            if (!penaltyExist) {
                return res.status(422).json({
                    success: false,
                    message: "No user exists!",
                });
            }
            const penaltyNameExist = await penaltiesPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (penaltyNameExist && penaltyNameExist.id !== id) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    penaltyExist: true,
                });
            }
            await penaltiesPrismaRepo.update(id, {
                name,
                title,
                type,
                repeated,
                minimum,
                Maximum,
                step,
                enabled,
                start,
                end,
            } as Penalty);

            return res.status(200).json({
                success: true,
                message: "penalty updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const penalties = (await penaltiesPrismaRepo.getAll()).filter(
                    (x) => x.enabled === true
                );
                return res.status(200).send(penalties);
            }
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send("Error revalidating");
    }
}
