import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { deleteWithLog } from "@/utils/deleteWithLog"

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const id = Number(params.id)
	const result = await deleteWithLog(prisma, "plant", id)
	if (result.ok) return NextResponse.json({ message: "Plant deleted" })
	return NextResponse.json({ error: "Erreur suppression plante" }, { status: 500 })
}
