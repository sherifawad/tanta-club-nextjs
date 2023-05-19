import { User } from "types";
import { promises as fs } from "fs";
import path from "path";

// users in JSON file for simplicity, store in a db for production applications
// let users = require("data/users.json") as User[];

const jsonDirectory = path.join(process.cwd(), "data");

const Users = (async function Users() {
    return JSON.parse(await fs.readFile(jsonDirectory + "/users.json", "utf8"));
})() as unknown as Promise<User[]>;

export const usersRepo = {
    getAll: async () => (await Users).map(({ password, ...rest }) => rest),
    getById: async (id: number) => (await Users).find((x) => x.id === id),
    find: async (x: (x: User) => boolean) => (await Users).find(x),
    create,
    update,
    delete: _delete,
};

async function create(user: User) {
    const users = await Users;
    // generate new user id
    user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;

    // set date created and updated
    user.createdAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    user.enabled = true;

    // add and save user
    users.push(user);
    await saveData(users);
}

async function update(id: number, params: { [x in keyof User]: User[x] }) {
    const users = await Users;
    const user = users.find((x) => x.id === id);
    if (user == null) return;
    // set date updated
    user.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(user, params);
    await saveData(users);
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    let users = await Users;
    // filter out deleted user and save
    users = users.filter((x) => x.id !== id);
    await saveData(users);
}

// private helper functions

async function saveData(users: User[]) {
    await fs.writeFile("data/users.json", JSON.stringify(users, null, 4));
}
