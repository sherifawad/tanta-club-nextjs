import { categoriesPrismaRepo } from "@/lib/categories-repo-prisma";
import { getCurrentUser } from "@/lib/session";
import { type Category, Role } from "@prisma/client";
import { error } from "console";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const filee = (req as any).files?.file;
            console.log("🚀 ~ file: categories.ts:14 ~ filee:", filee);

            const newCategory = req.body;
            console.log("🚀 ~ file: categories.ts:14 ~ req.body:", req.body);
            if (!newCategory || newCategory == null)
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            const {
                name,
                title,
                hidden,
                file,
            }: Category & { file: File | null } = JSON.parse(newCategory);
            console.log("🚀 ~ file: categories.ts:23 ~ file:", file);
            if (!name || name.length < 0 || !title || title.length < 0) {
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
            // Check if category exists
            const categoryExist = await categoriesPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (categoryExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    categoryExist: true,
                });
            }
            // Store new category
            const storeCategory = await categoriesPrismaRepo.create({
                name,
                hidden,
                title,
            });

            return res.status(201).json({
                success: true,
                message: "category created successfully",
                storeCategory,
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

            const { id, title, hidden, name }: Category = JSON.parse(req.body);

            const categoryExist = await categoriesPrismaRepo.getById(id);
            if (!categoryExist) {
                return res.status(422).json({
                    success: false,
                    message: "No user exists!",
                });
            }
            const categoryNameExist = await categoriesPrismaRepo.find({
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                title: {
                    equals: title,
                    mode: "insensitive",
                },
            });
            if (categoryNameExist && categoryNameExist.id !== id) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    categoryExist: true,
                });
            }
            const categories = await categoriesPrismaRepo.update(id, {
                name,
                title,
                hidden,
            });

            return res.status(200).json({
                success: true,
                message: "category updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const categories = (await categoriesPrismaRepo.getAll()).filter(
                    (x) => x.hidden === false
                );
                return res.status(200).send(categories);
            }
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        console.log("🚀 ~ file: categories.ts:113 ~ err:", err);
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send((error as any).message);
    }
}
