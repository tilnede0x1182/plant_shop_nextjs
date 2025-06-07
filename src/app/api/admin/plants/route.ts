import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
	const plants = await prisma.plant.findMany({
		orderBy: { name: "asc" }
	})
	return NextResponse.json(plants)
}
