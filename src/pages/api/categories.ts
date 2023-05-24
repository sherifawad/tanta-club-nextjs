import { getCurrentUser } from "@/lib/session";
import { error } from "console";
import { categoriesRepo } from "lib/categories-repo";
import type { NextApiRequest, NextApiResponse } from "next";
import { Category, Role } from "types";
import path from "path";
import { dataFolder } from "@/lib/utils";
import { tmpdir } from "os";
const fs = require("fs");
// categories in JSON file for simplicity, store in a db for production applications
// let categories = require("data/categories.json") as Category[];

// const jsonDirectory = path.join(process.cwd(), "data");
// const jsonDirectory = path.join(process.cwd(), "tmp", "data");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "POST") {
            const newCategory = req.body;
            if (!newCategory || newCategory == null)
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid method" });
            const { name, title, hidden }: Category = JSON.parse(newCategory);

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
            const categoryExist = await categoriesRepo.find(
                (x) => x.name === name
            );
            if (categoryExist) {
                return res.status(422).json({
                    success: false,
                    message: "A user with the same name already exists!",
                    categoryExist: true,
                });
            }
            // Store new category
            const storeCategory = await categoriesRepo.create({
                name,
                hidden,
                title,
            } as Category);

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
            const cats = JSON.parse(
                await fs.readFile("./categories.json", "utf8")
            ) as Category[];

            const category = cats.find((x) => x.id === id);
            if (!category || category == null) return;

            // set date updated
            category.updatedAt = new Date().toISOString();

            // update and save
            Object.assign(category, { title, hidden, name });
            fs.writeFileSync("./categories.json", JSON.stringify(req.body));

            // const categoryExist = await categoriesRepo.getById(id);
            // if (!categoryExist) {
            //     return res.status(422).json({
            //         success: false,
            //         message: "No user exists!",
            //     });
            // }
            // const categoryNameExist = await categoriesRepo.find(
            //     (x) => x.name === name
            // );
            // if (categoryNameExist && categoryNameExist.id !== id) {
            //     return res.status(422).json({
            //         success: false,
            //         message: "A user with the same name already exists!",
            //         categoryExist: true,
            //     });
            // }
            // const categories = await categoriesRepo.update(id, {
            //     name,
            //     title,
            //     hidden,
            // } as Category);

            return res.status(200).json({
                success: true,
                message: "category updated successfully",
            });
        } else {
            if (req.headers.appsecret === process.env.APP_SECRET) {
                const categories = (await categoriesRepo.getAll()).filter(
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
