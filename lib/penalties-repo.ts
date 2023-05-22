import { Penalty } from "types";

import { promises as fs } from "fs";
import path from "path";

// penalties in JSON file for simplicity, store in a db for production applications
// let penalties = require("data/penalties.json") as Penalty[];

const jsonDirectory = path.join(process.cwd(), "tmp", "data");

const Penalties = (async function Penalties() {
    return JSON.parse(
        await fs.readFile(jsonDirectory + "/penalties.json", "utf8")
    );
})() as unknown as Promise<Penalty[]>;

export const penaltiesRepo = {
    getAll: async () => await Penalties,
    getById: async (id: number) => (await Penalties).find((x) => x.id === id),
    find: async (x: (x: Penalty) => boolean) => (await Penalties).find(x),
    create,
    update,
    delete: _delete,
};

async function create(penalty: Penalty) {
    const penalties = await Penalties;
    // generate new penalty id
    penalty.id = penalties.length
        ? Math.max(...penalties.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    penalty.createdAt = new Date().toISOString();
    penalty.updatedAt = new Date().toISOString();

    // add and save penalty
    penalties.push(penalty);
    await saveData(penalties);
    return penalty;
}

async function update(
    id: number,
    params: { [x in keyof Penalty]: Penalty[x] }
) {
    const penalties = await Penalties;
    const penalty = penalties.find((x) => x.id === id) as Penalty | undefined;
    if (penalty == null) return;

    // set date updated
    penalty.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(penalty, params);
    await saveData(penalties);
    return penalty;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    let penalties = await Penalties;
    // filter out deleted penalty and save
    penalties = penalties.filter((x) => x.id !== id);
    await saveData(penalties);
}

// private helper functions

async function saveData(penalties: Penalty[]) {
    await fs.writeFile(
        `${jsonDirectory}/penalties.json`,
        JSON.stringify(penalties, null, 4)
    );
}
