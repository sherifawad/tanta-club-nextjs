import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import { isPasswordValid } from "lib/hash";
import { usersPrismaRepo } from "@/lib/users-repo-prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: number;
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
    session: {
        strategy: "jwt",
        maxAge: 7 * 60 * 60, // 7 hours
    },
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "credentials",
            id: "username-login",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                // username: {
                //     label: "الاسم",
                //     type: "text",
                //     placeholder: "اسم المستخدم",
                // },
                // password: { label: "كلمة السر", type: "password" },
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                try {
                    const { username, password } = credentials as {
                        username: string;
                        password: string;
                    };

                    const user = await usersPrismaRepo.find({
                        name: {
                            equals: username,
                            mode: "insensitive",
                        },
                        enabled: true,
                    });

                    if (!user) return null;

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
                } catch (error) {
                    console.log(
                        "🚀 ~ file: [...nextauth].ts:58 ~ authorize ~ error:",
                        error
                    );
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token ? token.id : undefined,
                    role: token ? token.role : undefined,
                },
            };
        },
    },
};

export default NextAuth(authOptions);
