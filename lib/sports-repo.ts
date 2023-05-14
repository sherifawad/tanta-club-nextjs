import { Discount, Sport } from "types";
import fs from "fs";
import { categoriesRepo } from "./categories-repo";
import { penaltiesRepo } from "./penalties-repo";
import { discountsRepo } from "./discounts-repo";

// sports in JSON file for simplicity, store in a db for production applications
let sports = require("data/sports.json") as Sport[];

export const sportsRepo = {
    getAll: () =>
        sports.map((sport) => {
            if (sport.penaltyId) {
                sport.penalty = penaltiesRepo.getById(sport.penaltyId);
            }
            if (sport.discounts != null && sport.discounts.length > 0) {
                let discountList: Discount[] = [];
                sport.discounts.forEach((discount) => {
                    discountList.push(discountsRepo.getById(discount.id)!);
                });
                sport.discounts = discountList;
            }
            return sport;
        }),
    getById: (id: number) => sports.find((x) => x.id === id),
    find: (x: (x: Sport) => boolean) => sports.find(x),
    create,
    update,
    delete: _delete,
};

function create(sport: Sport) {
    // check for categoryId is existing
    const getCategory = categoriesRepo.getById(sport.categoryId);
    if (getCategory == null) return;
    // check for penaltyId is existing
    if (sport.penaltyId != null) {
        const getPenalty = penaltiesRepo.getById(sport.penaltyId);
        if (getPenalty == null) return;
    }
    if (sport.discounts != null && sport.discounts.length > 0) {
        const allExists = sport.discounts.every(
            (discount) => discountsRepo.getById(discount.id) != null
        );
        if (allExists) return;
    }
    // generate new sport id
    sport.id = sports.length ? Math.max(...sports.map((x) => x.id)) + 1 : 1;

    // set date created and updated
    sport.createdAt = new Date().toISOString();
    sport.updatedAt = new Date().toISOString();

    // add and save sport
    sports.push(sport);
    saveData();
}

function update(id: number, params: { [x in keyof Sport]: Sport[x] }) {
    const sport = sports.find((x) => x.id === id) as Sport | undefined;
    if (sport == null) return;

    // set date updated
    sport.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(sport, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: number) {
    // filter out deleted sport and save
    sports = sports.filter((x) => x.id !== id);
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync("data/sports.json", JSON.stringify(sports, null, 4));
}
