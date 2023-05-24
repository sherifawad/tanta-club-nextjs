import { prisma } from "lib/prisma";
import type { Prisma } from "@prisma/client";

export const categoriesPrismaRepo = {
    getAll: async () => await prisma.category.findMany({}),
    getById: async (id: number) =>
        await prisma.category.findUnique({ where: { id } }),
    find: async (x: Prisma.CategoryWhereInput) =>
        await prisma.category.findFirst({ where: x }),
    create,
    update,
    delete: _delete,
};

async function create(user: Prisma.CategoryCreateInput) {
    try {
        return {
            user: await prisma.category.create({ data: user }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}

async function update(id: number, params: Prisma.CategoryUpdateInput) {
    try {
        return {
            user: await prisma.category.update({
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
            user: await prisma.category.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { user: null, error: error };
    }
}
