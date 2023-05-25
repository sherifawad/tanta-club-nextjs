import { PrismaClient } from "@prisma/client";

import * as categories from "./data/categories.json";
import * as discounts from "./data/discounts.json";
import * as penalties from "./data/penalties.json";
import * as sports from "./data/sports.json";
import * as users from "./data/users.json";
import type { Discount, Penalty, User } from "@prisma/client";

const client = new PrismaClient();
async function seed() {
    await client.sport.deleteMany();
    await client.category.deleteMany();
    await client.discount.deleteMany();
    await client.penalty.deleteMany();
    await client.user.deleteMany();

    categories.forEach(async (category) => {
        await client.category.create({ data: category });
    });

    (discounts as Discount[]).forEach(async (discount) => {
        await client.discount.create({ data: discount });
    });

    (penalties as Penalty[]).forEach(async (penalty) => {
        await client.penalty.create({ data: penalty });
    });

    (users as User[]).forEach(async (user) => {
        await client.user.create({ data: user });
    });

    sports.forEach(async (sport) => {
        const { discounts, ...rest } = sport;
        await client.sport.create({
            data: {
                ...rest,
                discounts:
                    discounts && discounts.length > 0
                        ? {
                              connect: discounts.map((disc) => ({
                                  id: disc.id,
                              })),
                          }
                        : undefined,
            },
        });
    });
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await client.$disconnect();
    });
