import { Discount } from "types";
import { promises as fs } from "fs";
import path from "path";

// discounts in JSON file for simplicity, store in a db for production applications
// let discounts = require("data/discounts.json") as Discount[];

const jsonDirectory = path.join(process.cwd(), "tmp", "data");

const Discounts = (async function Discounts() {
    return JSON.parse(
        await fs.readFile(jsonDirectory + "/discounts.json", "utf8")
    );
})() as unknown as Promise<Discount[]>;

export const discountsRepo = {
    getAll: async () => await Discounts,
    getById: async (id: number) => (await Discounts).find((x) => x.id === id),
    find: async (x: (x: Discount) => boolean) => (await Discounts).find(x),
    create,
    update,
    delete: _delete,
};

async function create(discount: Discount) {
    const discounts = await Discounts;
    // generate new discount id
    discount.id = discounts.length
        ? Math.max(...discounts.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    discount.createdAt = new Date().toISOString();
    discount.updatedAt = new Date().toISOString();

    // add and save discount
    discounts.push(discount);
    await saveData(discounts);
    return discount;
}

async function update(
    id: number,
    params: { [x in keyof Discount]: Discount[x] }
) {
    const discounts = await Discounts;
    const discount = discounts.find((x) => x.id === id) as Discount | undefined;
    if (discount == null) return;

    // set date updated
    discount.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(discount, params);
    await saveData(discounts);
    return discount;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    let discounts = await Discounts;

    // filter out deleted discount and save
    discounts = discounts.filter((x) => x.id !== id);
    await saveData(discounts);
}

// private helper functions

async function saveData(discounts: Discount[]) {
    fs.writeFile(
        `${jsonDirectory}/discounts.json`,
        JSON.stringify(discounts, null, 4)
    );
}
