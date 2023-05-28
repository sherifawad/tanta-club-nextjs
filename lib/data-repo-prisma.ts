import { prisma } from "lib/prisma";
import type { Prisma, Data, Sport } from "@prisma/client";
import { parseISO } from "date-fns";

export type dataInputProps = {
    from: string;
    to: string;
    categoryId: number;
};

export type SportData = Sport & {
    data: Data;
};

export type aggregatedData = {
    id: number;
    name: string | null | undefined;
    title: string | null | undefined;
    totalNumber: number;
    totalPrice: number;
};

export const dataPrismaRepo = {
    getAll: async () => await prisma.data.findMany({}),
    getById: async (id: number) =>
        await prisma.data.findUnique({ where: { id } }),
    find: async (x: Prisma.DataWhereInput) =>
        await prisma.data.findFirst({ where: x }),
    create,
    getCategoryData,
    update,
    delete: _delete,
};

async function getCategoryData({ from, to, categoryId }: dataInputProps) {
    try {
        const parsedFrom = parseISO(from);
        const parsedTo = parseISO(to);

        const sports = await prisma.data.groupBy({
            by: ["sportId"],
            where: {
                sport: {
                    categoryId,
                },
                from: {
                    gte: parsedFrom,
                },
                to: {
                    lte: parsedTo,
                },
                hidden: false,
            },
            _sum: {
                totalNumber: true,
                totalPrice: true,
            },
        });

        let datalist: aggregatedData[] = [];

        await Promise.all(
            sports.map(async (sport: any) => {
                const {
                    sportId,
                    _sum: { totalNumber, totalPrice },
                } = sport;
                const sportData = await prisma.sport.findUnique({
                    where: { id: sportId },
                    select: { name: true, title: true },
                });
                datalist = [
                    ...datalist,
                    {
                        id: sportId,
                        name: sportData?.name,
                        title: sportData?.title,
                        totalNumber,
                        totalPrice,
                    },
                ];
            })
        ).catch((error) => ({
            sports: null,
            error,
        }));

        return { sports: datalist as any, error: null };
    } catch (error) {
        return { sports: null, error };
    }
}

async function create(data: Prisma.DataCreateInput) {
    try {
        return { data: await prisma.data.create({ data: data }), error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

async function update(id: number, params: Prisma.DataUpdateInput) {
    try {
        return {
            data: await prisma.data.update({
                where: { id },
                data: params,
            }),
            error: null,
        };
    } catch (error) {
        return { data: null, error: error };
    }
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
async function _delete(id: number) {
    try {
        return {
            data: await prisma.data.delete({
                where: { id },
            }),
            error: null,
        };
    } catch (error) {
        return { data: null, error: error };
    }
}
