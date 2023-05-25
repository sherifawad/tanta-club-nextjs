import { PrismaClient } from "@prisma/client";

// import * as categories from "./data/categories.json";
// import * as discounts from "./data/discounts.json";
// import * as penalties from "./data/penalties.json";
// import * as sports from "./data/sports.json";
// import * as users from "./data/users.json";
const categories = require("./data/categories.json");
const discounts = require("./data/discounts.json");
const penalties = require("./data/penalties.json");
const sports = require("./data/sports.json");
const users = require("./data/users.json");
const sportsData = require("./data/sport-data.json");

const client = new PrismaClient();
async function seed() {
    await client.data.deleteMany();
    // await client.sport.deleteMany();
    // await client.category.deleteMany();
    // await client.discount.deleteMany();
    // await client.penalty.deleteMany();
    // await client.user.deleteMany();

    // await client.category.createMany({ data: categories });
    // await client.discount.createMany({ data: discounts });
    // await client.penalty.createMany({ data: penalties });
    // await client.user.createMany({ data: users });
    await client.data.createMany({ data: sportsData });

    // const sprts1 = sports.slice(0, 30);
    // const sprts2 = sports.slice(30, 60);
    // const sprts3 = sports.slice(60, 90);
    // const sprts4 = sports.slice(89);

    // Promise.all(
    //     sprts4.map((sport: any) => {
    //         const { discounts, ...rest } = sport;

    //         return client.sport.create({
    //             data: {
    //                 ...rest,

    //                 discounts:
    //                     discounts && discounts.length > 0
    //                         ? {
    //                               connect: discounts.map((disc: any) => ({
    //                                   id: disc.id,
    //                               })),
    //                           }
    //                         : undefined,
    //             },
    //         });
    //     })
    // )
    //     .then(() => console.info("[SEED] Successfully create Sport records"))
    //     .catch((e) =>
    //         console.error("[SEED] Failed to create Sport records", e)
    //     );
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await client.$disconnect();
    });
