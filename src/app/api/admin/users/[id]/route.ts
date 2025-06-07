import { NextRequest, NextResponse } from "next/server"
import type { NextApiRequestContext } from "next/dist/shared/lib/app-router-context"
import { PrismaClient } from "@prisma/client"
import { deleteWithLog } from "@/utils/deleteWithLog"

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest, context: NextApiRequestContext) {
	const id = Number(context.params.id)
	const result = await deleteWithLog(prisma, "user", id)

	if (result.ok) return NextResponse.json({ message: "User deleted" })
	return NextResponse.json({ error: "Erreur suppression user" }, { status: 500 })
}
