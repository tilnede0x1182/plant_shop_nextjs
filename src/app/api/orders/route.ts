import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json([], { status: 401 });
	}
	const userId = Number(session.user.id);
	const orders = await prisma.order.findMany({
		where: { userId },
		include: { orderItems: { include: { plant: true } } },
	});
	return NextResponse.json(orders);
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
	}
	const { items } = await request.json();
	if (!Array.isArray(items)) {
		return NextResponse.json(
			{ error: "Payload invalide" },
			{ status: 400 }
		);
	}
	const userId = Number(session.user.id);
	let total = 0;
	const order = await prisma.order.create({
		data: { userId, status: "confirmed", totalPrice: 0 },
	});
	for (const item of items) {
		const plant = await prisma.plant.findUnique({
			where: { id: item.plant_id },
		});
		if (!plant || plant.stock < item.quantity) {
			return NextResponse.json(
				{ error: `Stock insuffisant pour la plante ${item.plant_id}` },
				{ status: 400 }
			);
		}
		total += plant.price * item.quantity;
		await prisma.plant.update({
			where: { id: plant.id },
			data: { stock: plant.stock - item.quantity },
		});
		await prisma.orderItem.create({
			data: {
				orderId: order.id,
				plantId: plant.id,
				quantity: item.quantity,
			},
		});
	}
	const updatedOrder = await prisma.order.update({
		where: { id: order.id },
		data: { totalPrice: total },
	});
	return NextResponse.json(updatedOrder);
}
