import { getCurrentUser } from "@/lib/session";
import { usersPrismaRepo } from "@/lib/users-repo-prisma";
import { Role, type User } from "@prisma/client";
import { hashPassword, isPasswordValid } from "lib/hash";
import { NextApiRequest, NextApiResponse } from "next";

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
        const { name, password, role, enabled }: User = JSON.parse(newUser);
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
        if (
            user.role === Role.CLIENT ||
            user.role === Role.USER ||
            (user.role === Role.ADMIN &&
                (role === Role.ADMIN || role === Role.OWNER))
        ) {
            return res.status(401).send({
                message: "Un-Authorized",
            });
        }
        // Check if user exists
        const userExists = await usersPrismaRepo.find({
            name: {
                equals: name,
                mode: "insensitive",
            },
        });
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
        const storeUser = await usersPrismaRepo.create({
            name,
            role,
            password: hashedPassword,
            enabled,
        });

        return res.status(201).json({
            success: true,
            message: "User signed up successfuly",
            storeUser,
        });
    } else if (req.method === "PATCH") {
        const user = await getCurrentUser({ req, res });
        if (!user || user == null) {
            return res.status(401).send({
                message:
                    "You must be signed in to view the protected content on this page.",
            });
        }

        const {
            id,
            oldPassword,
            newPassword,
        }: { id?: number; oldPassword?: string; newPassword?: string } =
            JSON.parse(req.body);

        if (
            !id ||
            id === null ||
            !oldPassword ||
            oldPassword === null ||
            !newPassword ||
            newPassword === null
        ) {
            return res.status(403).json({
                message: "error parameter is required",
            });
        }

        const userExists = await usersPrismaRepo.getById(id);
        if (!userExists) {
            return res.status(422).json({
                success: false,
                message: "No user exists!",
            });
        }

        const isPasswordMatch = await isPasswordValid(
            oldPassword,
            userExists.password
        );

        if (!isPasswordMatch) {
            return res.status(422).json({
                success: false,
                message: "mismatch!",
            });
        }
        const hashedPassword = await hashPassword(newPassword);

        await usersPrismaRepo.update(id, {
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
        });
    } else if (req.method === "PUT") {
        const user = await getCurrentUser({ req, res });
        if (!user || user == null) {
            return res.status(401).send({
                message:
                    "You must be signed in to view the protected content on this page.",
            });
        }

        const { id, password, role, enabled, name }: User = JSON.parse(
            req.body
        );

        const userExists = await usersPrismaRepo.getById(id);

        if (!userExists) {
            return res.status(422).json({
                success: false,
                message: "No user exists!",
            });
        }

        const userNameExist = await usersPrismaRepo.find({
            name: {
                equals: name,
                mode: "insensitive",
            },
        });

        if (userNameExist && userNameExist.id !== id) {
            return res.status(422).json({
                success: false,
                message: "A user with the same name already exists!",
                categoryExist: true,
            });
        }

        if (
            user.role === Role.CLIENT ||
            user.role === Role.USER ||
            (user.role === Role.ADMIN &&
                (role === Role.ADMIN || role === Role.OWNER))
        ) {
            return res.status(401).send({
                message: "Un-Authorized",
            });
        }
        const userUpdated = {
            name,
            enabled,
            role,
            password: password
                ? await hashPassword(password)
                : userExists.password,
        } as User;
        await usersPrismaRepo.update(id, userUpdated);

        return res.status(200).json({
            success: true,
            message: "user updated successfully",
        });
    } else {
        return res
            .status(400)
            .json({ success: false, message: "Invalid method" });
    }
}
