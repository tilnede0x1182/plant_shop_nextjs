import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true }
  })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await request.json()
  const order = await prisma.order.update({ where: { id }, data })
  return NextResponse.json(order)
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  await prisma.order.delete({ where: { id } })
  return NextResponse.json({ message: "Order deleted" })
}
