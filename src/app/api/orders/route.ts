import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { orderItems: true }
  })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()
  const order = await prisma.order.create({ data })
  return NextResponse.json(order)
}
