import { prisma } from "lib/prisma";
import type { Prisma } from "@prisma/client/edge";

export const categoriesPrismaRepo = {
    getAll: async () => await prisma.discount.findMany({}),
    getById: async (id: number) =>
        await prisma.discount.findUnique({ where: { id } }),
    find: async (x: Prisma.DiscountWhereInput) =>
        await prisma.discount.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(user: Prisma.DiscountCreateInput) {
    try {
        return {
            user: await prisma.discount.create({ data: user }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}

async function update(id: number, params: Prisma.DiscountUpdateInput) {
    try {
        return {
            user: await prisma.discount.update({
                where: { id },
                data: params,
            }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    try {
        return {
            user: await prisma.discount.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}
