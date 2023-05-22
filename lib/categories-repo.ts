import { Category } from "types";

import { promises as fs } from "fs";
import path from "path";

// categories in JSON file for simplicity, store in a db for production applications
// let categories = require("data/categories.json") as Category[];

// const jsonDirectory = path.join(process.cwd(), "data");
const jsonDirectory = path.join(process.cwd(), "public", "data");

const Categories = (async function Categories() {
    return JSON.parse(
        await fs.readFile(jsonDirectory + "/categories.json", "utf8")
    );
})() as unknown as Promise<Category[]>;

export const categoriesRepo = {
    getAll: async () => await Categories,
    getById: async (id: number) => (await Categories).find((x) => x.id === id),
    find: async (x: (x: Category) => boolean) => (await Categories).find(x),
    create,
    update,
    delete: _delete,
};

async function create(category: Category) {
    const categories = await Categories;

    category.id = categories.length
        ? Math.max(...categories.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    category.createdAt = new Date().toISOString();
    category.updatedAt = new Date().toISOString();

    // add and save category
    categories.push(category);
    await saveData(categories);
    return category;
}

async function update(
    id: number,
    params: { [x in keyof Category]: Category[x] }
) {
    const categories = await Categories;

    const category = categories.find((x) => x.id === id);
    if (!category || category == null) return;

    // set date updated
    category.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(category, params);
    await saveData(categories);
    return category;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    let categories = await Categories;

    // filter out deleted category and save
    categories = categories.filter((x) => x.id !== id);
    await saveData(categories);
}

// private helper functions

async function saveData(categories: Category[]) {
    await fs.writeFile(
        `${jsonDirectory}/categories.json`,
        JSON.stringify(categories, null, 4)
    );
}
