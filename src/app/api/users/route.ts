import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export async function GET() {
	const users = await prisma.user.findMany({
		orderBy: [{ admin: "desc" }, { name: "asc" }],
	});

	return NextResponse.json(users);
}

export async function POST(request: Request) {
	const data = await request.json();
	// console.log("Données reçues à l'inscription :", data); // log reçu
	console.log(
		"Inscription reçue : email =",
		data.email,
		"name =",
		data.name,
		"password (en clair) =",
		data.password
	);

	try {
		const hashedPassword = await bcrypt.hash(data.password, 10);
		const user = await prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				password: hashedPassword,
			},
		});
		console.log("Utilisateur créé en base :", user); // log base
		return NextResponse.json(user);
	} catch (exception: unknown) {
		if (exception.code === "P2002") {
			return NextResponse.json(
				{ error: "Cet email existe déjà." },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ error: "Erreur lors de la création de l'utilisateur." },
			{ status: 500 }
		);
	}
}
