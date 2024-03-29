// import { promises as fs } from "fs";
// import path from "path";
// import { dataFolder } from "./utils";
import { prisma } from "lib/prisma";
import type { Prisma, User } from "@prisma/client";

// users in JSON file for simplicity, store in a db for production applications
// let users = require("data/users.json") as User[];

// const jsonDirectory = path.join(process.cwd(), "tmp");
// const dataFilePath = path.join(process.cwd(), "data", "users.json");

// const Users = (async function Users() {
//     return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
// })() as unknown as Promise<User[]>;

// export const usersRepo = {
//     getAll: async () => (await Users).map(({ password, ...rest }) => rest),
//     getById: async (id: number) => (await Users).find((x) => x.id === id),
//     find: async (x: (x: User) => boolean) => (await Users).find(x),
//     create,
//     update,
//     delete: _delete,
// };
export const usersPrismaRepo = {
    getAll: async () => await prisma.user.findMany({}),
    getById: async (id: number) =>
        await prisma.user.findUnique({ where: { id } }),
    find: async (x: Prisma.UserWhereInput) =>
        await prisma.user.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(user: Prisma.UserCreateInput) {
    try {
        return { user: await prisma.user.create({ data: user }), error: null };
    } catch (error) {
        return { user: null, error: error };
    }
    // const users = await Users;
    // // generate new user id
    // user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;

    // // set date created and updated
    // user.createdAt = new Date().toISOString();
    // user.updatedAt = new Date().toISOString();

    // user.enabled = true;

    // // add and save user
    // users.push(user);
    // await saveData(users);
    // return user;
}

async function update(id: number, params: Prisma.UserUpdateInput) {
    // const users = await Users;
    // const user = users.find((x) => x.id === id);
    // if (!user || user == null) return;
    // // set date updated
    // user.updatedAt = new Date().toISOString();
    // // update and save
    // Object.assign(user, params);
    // await saveData(users);
    // return user;
    try {
        return {
            user: await prisma.user.update({
                where: { id },
                data: params,
            }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    // let users = await Users;
    // // filter out deleted user and save
    // users = users.filter((x) => x.id !== id);
    // await saveData(users);
    try {
        return {
            user: await prisma.user.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}

// private helper functions

// async function saveData(users: User[]) {
//     // await fs.unlink(`${dataFilePath}`);
//     await fs.writeFile(`${dataFilePath}`, JSON.stringify(users, null, 4), {
//         encoding: "utf8",
//         flag: "w",
//     });
// }
