import { Category } from "types";
import fs from "fs";

// categories in JSON file for simplicity, store in a db for production applications
let categories = require("data/categories.json") as Category[];

export const categoriesRepo = {
    getAll: () => categories,
    getById: (id: number) => categories.find((x) => x.id === id),
    find: (x: (x: Category) => boolean) => categories.find(x),
    create,
    update,
    delete: _delete,
};

function create(category: Category) {
    // generate new category id
    category.id = categories.length
        ? Math.max(...categories.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    category.createdAt = new Date().toISOString();
    category.updatedAt = new Date().toISOString();

    // add and save category
    categories.push(category);
    saveData();
}

function update(id: number, params: { [x in keyof Category]: Category[x] }) {
    const category = categories.find((x) => x.id === id) as
        | Category
        | undefined;
    if (category == null) return;

    // set date updated
    category.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(category, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: number) {
    // filter out deleted category and save
    categories = categories.filter((x) => x.id !== id);
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync(
        "data/categories.json",
        JSON.stringify(categories, null, 4)
    );
}
