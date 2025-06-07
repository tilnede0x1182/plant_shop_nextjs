import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
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
				const isValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isValid) return null;
				return {
					id: user.id,
					email: user.email,
					name: user.name,
					admin: user.admin,
				};
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (token)
				session.user = {
					id: token.id,
					email: token.email,
					name: token.name,
					admin: token.admin,
				};
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.admin = user.admin;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
	},
	session: { strategy: "jwt" },
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
