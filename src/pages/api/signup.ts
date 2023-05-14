import { hashPassword } from "lib/hash";
import { usersRepo } from "lib/users-repo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const newUser = req.body;

        // Check if user exists
        const userExists = usersRepo.find((x) => x.name === newUser.name);
        if (userExists) {
            res.status(422).json({
                success: false,
                message: "A user with the same name already exists!",
                userExists: true,
            });
            return;
        }

        // Hash Password
        newUser.password = await hashPassword(newUser.password);

        // Store new user
        const storeUser = usersRepo.create(newUser);

        res.status(201).json({
            success: true,
            message: "User signed up successfuly",
        });
    } else {
        res.status(400).json({ success: false, message: "Invalid method" });
    }
}
