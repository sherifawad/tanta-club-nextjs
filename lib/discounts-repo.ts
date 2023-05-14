import { Discount } from "types";
import fs from "fs";

// discounts in JSON file for simplicity, store in a db for production applications
let discounts = require("data/discounts.json") as Discount[];

export const discountsRepo = {
    getAll: () => discounts,
    getById: (id: number) => discounts.find((x) => x.id === id),
    find: (x: (x: Discount) => boolean) => discounts.find(x),
    create,
    update,
    delete: _delete,
};

function create(discount: Discount) {
    // generate new discount id
    discount.id = discounts.length
        ? Math.max(...discounts.map((x) => x.id)) + 1
        : 1;

    // set date created and updated
    discount.createdAt = new Date().toISOString();
    discount.updatedAt = new Date().toISOString();

    // add and save discount
    discounts.push(discount);
    saveData();
}

function update(id: number, params: { [x in keyof Discount]: Discount[x] }) {
    const discount = discounts.find((x) => x.id === id) as Discount | undefined;
    if (discount == null) return;

    // set date updated
    discount.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(discount, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: number) {
    // filter out deleted discount and save
    discounts = discounts.filter((x) => x.id !== id);
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync("data/discounts.json", JSON.stringify(discounts, null, 4));
}
