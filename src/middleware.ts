import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

// Routes accessibles sans authentification
const publicRoutes = ["/", "/plants", "/auth/signin", "/auth/register", "/cart"];

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret });
	const { pathname } = req.nextUrl;

	// Vérifie si la route est publique
	const isPublic = publicRoutes.some((route) => pathname === route || (route === "/plants" && pathname.startsWith("/plants/")));

	// Cas 1 : pas connecté et route non publique → redirection login
	if (!token && !isPublic) {
		return NextResponse.redirect(new URL("/auth/signin", req.url));
	}

	// Cas 2 : pas admin mais accès à /admin → redirection unauthorized
	if (token && !token.admin && pathname.startsWith("/admin")) {
		const url = req.nextUrl.clone();
		url.pathname = "/plants";
		return NextResponse.redirect(url);
	}

	// OK → laisser passer
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)).*)"],
};
