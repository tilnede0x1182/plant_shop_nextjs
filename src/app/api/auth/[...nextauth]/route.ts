import NextAuth, { NextAuthOptions, DefaultSession, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Extend DefaultSession to add id and admin on user
declare module "next-auth" {
	interface Session extends DefaultSession {
		user?: DefaultSession["user"] & {
			id: string;
			admin?: boolean;
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) return null;
				const isValid = await bcrypt.compare(credentials.password, user.password);
				if (!isValid) return null;
				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name ?? undefined,
					admin: user.admin,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }): Promise<JWT> {
			if (user) {
				type UserWithExtras = {
					id: string;
					admin?: boolean;
				};

				const u = user as UserWithExtras;
				token.sub = u.id;
				token.admin = u.admin;
			}
			return token;
		},
		async session({ session, token }): Promise<Session> {
			if (token.sub) {
				// Vérifie en BDD que l’utilisateur existe encore
				const user = await prisma.user.findUnique({ where: { id: Number(token.sub) } });
				if (user) {
					// met à jour la session depuis la BDD
					session.user = {
						...session.user,
						id: user.id.toString(),
						email: user.email,
						name: user.name ?? undefined,
						admin: user.admin,
					};
				} else {
					// utilisateur supprimé → on invalide
					delete session.user;
				}
			}
			return session;
		},
	},
	session: { strategy: "jwt" },
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
