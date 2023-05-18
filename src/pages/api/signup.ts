import { getCurrentUser } from "@/lib/session";
import { isIterable } from "@/lib/utils";
import { hashPassword } from "lib/hash";
import { usersRepo } from "lib/users-repo";
import { NextApiRequest, NextApiResponse } from "next";
import { Role, User } from "types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const newUser = req.body;
        if (!newUser || newUser == null)
            return res
                .status(400)
                .json({ success: false, message: "Invalid method" });
        const { name, password, role }: User = JSON.parse(newUser);
        if (
            !name ||
            name.length < 0 ||
            !password ||
            password.length < 0 ||
            !role ||
            !(role in Role) ||
            role.length < 0
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
        if (user.role === Role.CLIENT) {
            return res.status(401).send({
                message: "Un-Authorized",
            });
        }
        // Check if user exists
        const userExists = await usersRepo.find((x) => x.name === name);
        if (userExists) {
            return res.status(422).json({
                success: false,
                message: "A user with the same name already exists!",
                userExists: true,
            });
        }

        // Hash Password
        const hashedPassword = await hashPassword(password);

        // Store new user
        const storeUser = await usersRepo.create({
            name,
            role,
            password: hashedPassword,
        } as User);

        return res.status(201).json({
            success: true,
            message: "User signed up successfuly",
            storeUser,
        });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid method" });
    }
}
