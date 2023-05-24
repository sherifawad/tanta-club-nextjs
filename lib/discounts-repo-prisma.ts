import { prisma } from "lib/prisma";
import type { Prisma } from "@prisma/client/edge";

export const discountsPrismaRepo = {
    getAll: async () => await prisma.discount.findMany({}),
    getById: async (id: number) =>
        await prisma.discount.findUnique({ where: { id } }),
    find: async (x: Prisma.DiscountWhereInput) =>
        await prisma.discount.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(discount: Prisma.DiscountCreateInput) {
    try {
        return {
            discount: await prisma.discount.create({ data: discount }),
            error: null,
        };
    } catch (error) {
        return { discount: null, error: error };
    }
}

async function update(id: number, params: Prisma.DiscountUpdateInput) {
    try {
        return {
            discount: await prisma.discount.update({
                where: { id },
                data: params,
            }),
            error: null,
        };
    } catch (error) {
        return { discount: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    try {
        return {
            discount: await prisma.discount.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { discount: null, error: error };
    }
}
