import { prisma } from "lib/prisma";
import type { Prisma, Data, Sport } from "@prisma/client";
import { parseISO } from "date-fns";
import { divvyUp } from "helpers/arrayUtils";
import { ConvertToDate } from "./utils";

export type dataInputProps = {
    from: string;
    to: string;
    categoryId: number | undefined;
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
    discounts?: { id: number }[] | null;
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
        // const formValidDay = new Date(
        //     new Date(from as string).getFullYear(),
        //     new Date(from as string).getMonth(),
        //     new Date(from as string).getDate()
        // );
        // const toValidDay = new Date(
        //     new Date(to as string).getFullYear(),
        //     new Date(to as string).getMonth(),
        //     new Date(to as string).getDate()
        // );
        const formValidDay = ConvertToDate(from);
        const toValidDay = ConvertToDate(to);

        // const parsedFrom = parseISO(formValidDay);

        // const parsedTo = parseISO(to);

        const sports = await prisma.data.groupBy({
            by: ["sportId"],
            where: {
                sport: categoryId
                    ? {
                          categoryId,
                      }
                    : undefined,
                from: {
                    gte: formValidDay,
                },
                to: {
                    lte: toValidDay,
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
                    select: {
                        name: true,
                        title: true,
                        discounts: { select: { id: true } },
                    },
                });
                datalist = [
                    ...datalist,
                    {
                        id: sportId,
                        name: sportData?.name,
                        title: sportData?.title,
                        totalNumber,
                        totalPrice,
                        discounts: sportData?.discounts,
                    },
                ];
            })
        ).catch((error) => ({
            sports: null,
            error,
        }));

        const [sportsWithDiscount, onlySports] = divvyUp(datalist, (sport) =>
            categoryId === 1 || categoryId == undefined
                ? sport.discounts &&
                  sport.discounts.length > 0 &&
                  !sport.name?.includes("rivat")
                : sport.discounts && sport.discounts.length > 0
        );

        const others = onlySports?.reduce(
            (acc, sport) => {
                return {
                    ...acc,
                    totalNumber: acc.totalNumber + sport.totalNumber,
                    totalPrice: acc.totalPrice + sport.totalPrice,
                };
            },
            {
                id: 200,
                name: "other",
                title: "اخري",
                totalNumber: 0,
                totalPrice: 0,
            } as aggregatedData
        );

        const monthly = sportsWithDiscount?.reduce(
            (acc, sport) => {
                return {
                    ...acc,
                    totalNumber: acc.totalNumber + sport.totalNumber,
                    totalPrice: acc.totalPrice + sport.totalPrice,
                };
            },
            {
                id: 201,
                name: "monthly",
                title: "شهري",
                totalNumber: 0,
                totalPrice: 0,
            } as aggregatedData
        );

        return {
            sports: [monthly, others] as any,
            error: null,
            range: {
                from: formValidDay,
                to: toValidDay,
            },
        };
        return { sports: datalist as any, error: null };
    } catch (error) {
        return { sports: null, error, range: null };
    }
}

async function create(data: Prisma.DataCreateInput) {
    try {
        return { data: await prisma.data.create({ data: data }), error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

async function update(
    {
        from,
        to,
        sportId,
    }: {
        from: any;
        to: any;
        sportId: any;
    },
    params: Prisma.DataUpdateInput
) {
    try {
        return {
            data: await prisma.data.update({
                where: {
                    from_to_sportId: {
                        from,
                        to,
                        sportId,
                    },
                },
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
