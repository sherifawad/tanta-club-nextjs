import DateRange from "@/components/DateRange";
import Sidebar from "@/components/sidebar";
import { Category, Role } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { categoriesPrismaRepo } from "@/lib/categories-repo-prisma";

type DashboardProps = {
    categories: Category[] | null;
};
const Dashboard = ({ categories }: DashboardProps) => {
    const [date, setDate] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    const [category, setCategory] = useState<Category | null>(null);
    return (
        <div>
            <Sidebar setCategory={setCategory} categoriesList={categories}>
                <DateRange setDate={setDate} />
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
