import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { usersRepo } from "lib/users-repo";
import { isPasswordValid } from "lib/hash";
import { Role } from "types";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }

    interface User {
        id: number;
        name: string;
        role: Role;
    }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "الاسم",
                    type: "text",
                    placeholder: "اسم المستخدم",
                },
                password: { label: "كلمة السر", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)

                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };
                const user = usersRepo.find((x) => x.name === username);
                if (user == null || !user.enabled) {
                    return null;
                }

                // Validate password
                const isPasswordMatch = await isPasswordValid(
                    password,
                    user.password
                );

                if (!isPasswordMatch) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
                role: user.role,
            },
        }),
    },
};

export default NextAuth(authOptions);
