import DateRange from "@/components/DateRange";
import Sidebar from "@/components/sidebar";
import { Category, Role, Sport } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { categoriesPrismaRepo } from "@/lib/categories-repo-prisma";
import { getBaseUrl } from "@/lib/utils";
import TopCards from "@/components/TopCards";
import { aggregatedData } from "@/lib/data-repo-prisma";

export type RangeInputType = { from: string; to: string };

type DashboardProps = {
    categories: Category[] | null;
};
const Dashboard = ({ categories }: DashboardProps) => {
    const [date, setDate] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    const [category, setCategory] = useState<Category | null>(null);
    const [sportsList, setSportsList] = useState<aggregatedData[] | null>([]);

    const onCategoryChange = (category: Category | null) => {
        setCategory(category);
        setSportsList([]);
    };

    const onRangeSelect = async ({ from, to }: RangeInputType) => {
        try {
            const response = await fetch(`${getBaseUrl()}/api/dashboard`, {
                method: "POST",
                body: JSON.stringify({ from, to, categoryId: category?.id }),
                credentials: "include",
            });
            const {
                sports,
                success,
            }: {
                success: boolean;
                sports: aggregatedData[] | null;
            } = await response.json();
            setSportsList(sports);
        } catch (error) {}
    };

    return (
        <div className="">
            <Sidebar
                onCategoryChange={onCategoryChange}
                categoriesList={categories}
            >
                <div className="container grid grid-cols-1 gap-2 p-1 mx-auto">
                    <h1 className="mx-auto text-3xl font-bold text-orange-500">
                        {category?.title ?? "الكل"}
                    </h1>
                    <DateRange onRangeSelect={onRangeSelect} />
                    <TopCards
                        sportsData={sportsList ?? []}
                        category={category}
                    />
                </div>
            </Sidebar>
        </div>
    );
};

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    try {
        // const session = await getServerSession(req, res, authOptions);
        // if (
        //     !session ||
        //     (session &&
        //         session.user.role !== Role.OWNER &&
        //         session.user.role !== Role.ADMIN &&
        //         session.user.role !== Role.DASHBOARD)
        // ) {
        //     return {
        //         redirect: {
        //             permanent: false,
        //             destination: "/",
        //         },
        //     };
        // }
        const categoriesList = await categoriesPrismaRepo.getAll();
        return {
            props: {
                categories: JSON.parse(JSON.stringify(categoriesList)),
            },
        };
    } catch (error) {
        return {
            props: {},
        };
    }
}

export default Dashboard;
