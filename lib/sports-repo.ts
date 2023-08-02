import { Discount, Sport } from "types";
import { promises as fs } from "fs";
import path from "path";
import { categoriesRepo } from "./categories-repo";
import { penaltiesRepo } from "./penalties-repo";
import { discountsRepo } from "./discounts-repo";
import { dataFolder } from "./utils";

// sports in JSON file for simplicity, store in a db for production applications
// let sports = require("data/sports.json") as Sport[];

// const jsonDirectory = path.join(process.cwd(), "tmp");
const dataFilePath = dataFolder("sports.json");

const Sports = (async function Sports() {
    return JSON.parse(await fs.readFile(dataFilePath, "utf8"));
})() as unknown as Promise<Sport[]>;

export const sportsRepo = {
    getSports: async () => await Sports,
    getAll: async () => {
        const sports = await Sports;
        const result = sports.reduce(async (acc, current) => {
            let sport = current;
            if (sport.penaltyId) {
                sport.penalty = await penaltiesRepo.getById(sport.penaltyId);
            }
            if (sport.discounts != null && sport.discounts.length > 0) {
                let discountList: Discount[] = [];
                sport.discounts.forEach(async (discount) => {
                    const discountExist = await discountsRepo.getById(
                        discount?.id
                    );
                    if (discountExist) {
                        discountList.push(discountExist);
                    }
                });
                sport.discounts = discountList;
            }
            return [...(await acc), sport];
        }, [] as unknown as Promise<Sport[]>);

        return result;
    },
    getById: async (id: number) => (await Sports).find((x) => x.id === id),
    find: async (x: (x: Sport) => boolean) => (await Sports).find(x),
    create,
    update,
    delete: _delete,
};

async function create(sport: Sport) {
    const sports = await Sports;

    const connectedSport = await connectSportToExistingData(sport);
    if (connectedSport == null) return;
    sport = connectedSport;

    // generate new sport id
    sport.id = sports.length ? Math.max(...sports.map((x) => x.id)) + 1 : 1;

    // set date created and updated
    sport.createdAt = new Date().toISOString();
    sport.updatedAt = new Date().toISOString();

    // add and save sport
    sports.push(sport);
    await saveData(sports);
    return sport;
}

async function update(id: number, params: { [x in keyof Sport]: Sport[x] }) {
    const sports = await Sports;

    let sport = sports.find((x) => x.id === id) as Sport | undefined;
    if (sport == null) return;

    const connectedSport = await connectSportToExistingData(sport);
    if (connectedSport == null) return;
    sport = connectedSport;

    // set date updated
    sport.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(sport, params);
    await saveData(sports);
    return sport;
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    let sports = await Sports;

    // filter out deleted sport and save
    sports = sports.filter((x) => x.id !== id);
    await saveData(sports);
}

async function connectSportToExistingData(sport: Sport) {
    // check for categoryId is existing
    const getCategory = await categoriesRepo.getById(sport.categoryId ?? 0);
    if (getCategory == null) return null;
    // check for penaltyId is existing
    if (sport.penaltyId != null) {
        const getPenalty = await penaltiesRepo.getById(sport.penaltyId);
        if (getPenalty == null) sport.penaltyId = null;
    }
    const discountsExistList: {
        id: number;
    }[] = [];
    if (sport.discounts != null && sport.discounts.length > 0) {
        sport.discounts.forEach(async ({ id }) => {
            const discountExist = await discountsRepo.getById(id);
            if (discountExist) {
                discountsExistList.push({ id });
            }
        });
        if (discountsExistList.length > 0) {
            sport.discounts = discountsExistList;
        }
    }
    return sport;
}

// private helper functions

async function saveData(sports: Sport[]) {
    fs.writeFile(`${dataFilePath}`, JSON.stringify(sports, null, 4));
}
