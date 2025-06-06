import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: paramId } = await params
  const id = Number(paramId)
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await request.json()
  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json(user)
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ message: "User deleted" })
}
