import { Penalty } from "types";
import fs from "fs";

// penalties in JSON file for simplicity, store in a db for production applications
let penalties = require("data/penalties.json") as Penalty[];

export const penaltiesRepo = {
    getAll: () => penalties,
    getById: (id: number) => penalties.find((x) => x.id === id),
    find: (x: (x: Penalty) => boolean) => penalties.find(x),
    create,
    update,
    delete: _delete,
};

function create(penalty: Penalty) {
    // generate new penalty id
    penalty.id = penalties.length
        ? Math.max(...penalties.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    penalty.createdAt = new Date().toISOString();
    penalty.updatedAt = new Date().toISOString();

    // add and save penalty
    penalties.push(penalty);
    saveData();
}

function update(id: number, params: { [x in keyof Penalty]: Penalty[x] }) {
    const penalty = penalties.find((x) => x.id === id) as Penalty | undefined;
    if (penalty == null) return;

    // set date updated
    penalty.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(penalty, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: number) {
    // filter out deleted penalty and save
    penalties = penalties.filter((x) => x.id !== id);
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync("data/penalties.json", JSON.stringify(penalties, null, 4));
}
