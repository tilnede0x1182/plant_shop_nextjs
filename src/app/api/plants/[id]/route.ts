import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const plant = await prisma.plant.findUnique({ where: { id } })
  if (!plant) return NextResponse.json({ error: "Plant not found" }, { status: 404 })
  return NextResponse.json(plant)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await request.json()
  const plant = await prisma.plant.update({ where: { id }, data })
  return NextResponse.json(plant)
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.plant.delete({ where: { id } })
  return NextResponse.json({ message: "Plant deleted" })
}
