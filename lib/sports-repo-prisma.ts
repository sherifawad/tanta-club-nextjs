import { prisma } from "lib/prisma";
import type { Prisma, Sport, Penalty, Discount } from "@prisma/client";

export type SportToEditType = Sport & {
    discounts?: Prisma.DiscountWhereUniqueInput[];
};

export const sportsPrismaRepo = {
    getSports: async () =>
        await prisma.sport.findMany({
            include: {
                discounts: {
                    select: {
                        id: true,
                    },
                },
            },
        }),
    getSportsName: async () =>
        await prisma.sport.findMany({
            select: {
                id: true,
                name: true,
                title: true,
                categoryId: true,
            },
        }),
    getAll: async () =>
        await prisma.sport.findMany({
            include: {
                discounts: true,
                penalty: true,
            },
        }),
    getById: async (id: number) =>
        await prisma.sport.findUnique({ where: { id } }),
    find: async (x: Prisma.SportWhereInput) =>
        await prisma.sport.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(sport: SportToEditType) {
    console.log("🚀 ~ file: sports-repo-prisma.ts:45 ~ create ~ sport:", sport);
    const { discounts, penaltyId, categoryId, ...rest } = sport;

    try {
        return {
            sport: await prisma.sport.create({
                data: {
                    ...rest,
                    penalty: penaltyId
                        ? {
                              connect: {
                                  id: penaltyId,
                              },
                          }
                        : undefined,
                    category: categoryId
                        ? {
                              connect: {
                                  id: categoryId,
                              },
                          }
                        : undefined,
                    discounts: { connect: discounts },
                } as any,
            }),
            error: null,
        };
    } catch (error) {
        return { sport: null, error: error };
    }
}

async function update(id: number, params: SportToEditType) {
    const { discounts, penaltyId, categoryId, ...rest } = params;

    try {
        return {
            sport: await prisma.sport.update({
                where: { id },
                data: {
                    ...rest,
                    penalty: penaltyId
                        ? {
                              connect: {
                                  id: penaltyId,
                              },
                          }
                        : undefined,
                    category: categoryId
                        ? {
                              connect: {
                                  id: categoryId,
                              },
                          }
                        : undefined,
                    discounts: { connect: discounts },
                } as any,
            }),
            error: null,
        };
    } catch (error) {
        return { sport: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    try {
        return {
            sport: await prisma.sport.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { sport: null, error: error };
    }
}

function connectSportToDiscounts(
    discounts: Prisma.DiscountWhereUniqueInput[] | undefined | null
) {
    if (!discounts || discounts == null || discounts.length < 1)
        return undefined;
    return {
        connect: discounts.map((id) => id),
    } as
        | Prisma.DiscountUncheckedCreateNestedManyWithoutSportsInput
        | Prisma.DiscountCreateNestedManyWithoutSportsInput;
}
