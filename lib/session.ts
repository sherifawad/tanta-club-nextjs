import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next";
import { getServerSession } from "next-auth/next";

type Params = {
    req: NextApiRequest | GetServerSidePropsContext["req"];
    res: NextApiResponse | GetServerSidePropsContext["res"];
};

export async function getSession(params?: Params) {
    if (!params) return await getServerSession(authOptions);
    return await getServerSession(params.req, params.res, authOptions);
}

export async function getCurrentUser(params?: Params) {
    const session = await getSession(params);

    return session?.user;
}
