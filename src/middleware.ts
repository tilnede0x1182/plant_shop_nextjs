import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret });
	const url = req.nextUrl.clone();

	// pas connecté → redirection login
	if (!token && req.nextUrl.pathname.startsWith("/admin")) {
		return NextResponse.redirect(new URL("/auth/signin", req.url));
	}

	if (token) {
		const user = await prisma.user.findUnique({ where: { id: Number(token.sub) } });

		if (!user) {
			// utilisateur supprimé en BDD → forcer login
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}

		if (!user.admin && url.pathname.startsWith("/admin")) {
			// utilisateur non admin → bloqué
			url.pathname = "/unauthorized";
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
