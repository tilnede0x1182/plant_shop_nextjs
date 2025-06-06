"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

type OrderItem = {
	id: number
	quantity: number
	plant: {
		id: number
		name: string
		price: number
	}
}

type Order = {
	id: number
	createdAt: string
	totalPrice: number
	status: string
	orderItems: OrderItem[]
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([])

	useEffect(() => {
		fetch("/api/orders")
			.then(res => res.json())
			.then(data => setOrders(data))
	}, [])

	return (
		<>
			<h1 className="text-center mb-4">📜 Mes Commandes</h1>
			{orders.length > 0 ? (
				orders.map((order, index) => (
					<div className="card mb-3 shadow-sm" key={order.id}>
						<div className="card-body">
							<h5 className="card-title">Commande n°{orders.length - index}</h5>
							<p className="mb-1 text-muted">
								Passée le {new Date(order.createdAt).toLocaleString()} – Total : {order.totalPrice} €
							</p>
							<ul className="mb-2">
								{order.orderItems.map(item => (
									<li key={item.id}>
										<Link
											href={`/plants/${item.plant.id}`}
											className="text-decoration-none text-primary"
										>
											{item.plant.name}
										</Link>{" "}
										{item.quantity} × {item.plant.price} €
									</li>
								))}
							</ul>
							<p>
								<strong>Statut :</strong> {order.status}
							</p>
						</div>
					</div>
				))
			) : (
				<p className="alert alert-info">Aucune commande pour le moment.</p>
			)}
		</>
	)
}
