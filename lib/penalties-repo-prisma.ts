import { prisma } from "lib/prisma";
import type { Prisma } from "@prisma/client";

export const penaltiesPrismaRepo = {
    getAll: async () => await prisma.penalty.findMany({}),
    getById: async (id: number) =>
        await prisma.penalty.findUnique({ where: { id } }),
    find: async (x: Prisma.PenaltyWhereInput) =>
        await prisma.penalty.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(penalty: Prisma.PenaltyCreateInput) {
    try {
        return {
            penalty: await prisma.penalty.create({ data: penalty }),
            error: null,
        };
    } catch (error) {
        return { penalty: null, error: error };
    }
}

async function update(id: number, params: Prisma.PenaltyUpdateInput) {
    try {
        return {
            penalty: await prisma.penalty.update({
                where: { id },
                data: params,
            }),
            error: null,
        };
    } catch (error) {
        return { penalty: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    try {
        return {
            penalty: await prisma.penalty.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { penalty: null, error: error };
    }
}
