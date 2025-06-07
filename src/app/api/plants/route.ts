import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
	const plants = await prisma.plant.findMany({
		where: { stock: { gte: 1 } },
		orderBy: { name: "asc" },
	});
	return NextResponse.json(plants);
}

export async function POST(request: Request) {
	const data = await request.json();
	const plant = await prisma.plant.create({ data });
	return NextResponse.json(plant);
}
