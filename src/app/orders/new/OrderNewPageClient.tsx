"use client"

import { useEffect, useState, FormEvent } from "react"

export default function OrderNewPageClient({ userId }: { userId: number }) {
	const [cartItems, setCartItems] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [alert, setAlert] = useState("")

	useEffect(() => {
		const stored = localStorage.getItem("cart")
		if (stored) {
			let parsed = JSON.parse(stored)
			if (!Array.isArray(parsed) && typeof parsed === "object") {
				parsed = Object.values(parsed)
			}
			setCartItems(parsed)
		}
		setLoading(false)
	}, [])

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const items = cartItems.map(({ id, quantity }) => ({
			plant_id: id,
			quantity,
		}))
		const res = await fetch("/api/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items, userId }),
		})
		if (res.ok) {
			localStorage.removeItem("cart")
			window.location.href = "/orders"
		} else {
			const data = await res.json()
			setAlert(data.message || "Erreur lors de la validation de la commande.")
		}
	}

	if (loading) return <p className="alert alert-info">Chargement de votre panier...</p>

	return (
		<div>
			<h1 className="text-center mb-4">Valider ma commande</h1>
			{alert && <div className="alert alert-danger">{alert}</div>}

			<div id="order-review-container">
				{cartItems.length === 0 ? (
					<p className="alert alert-info">Votre panier est vide.</p>
				) : (
					<table className="table shadow">
						<thead className="table-light">
							<tr>
								<th>Plante</th>
								<th>Quantité</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{cartItems.map((item) => (
								<tr key={item.id}>
									<td>
										<a href={`/plants/${item.id}`} className="cart-plant-link">
											{item.name}
										</a>
									</td>
									<td>{item.quantity}</td>
									<td>{item.price * item.quantity} €</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{cartItems.length > 0 && (
					<p className="text-end fw-bold">
						Total :{" "}
						{cartItems.reduce((t, item) => t + item.price * item.quantity, 0)} €
					</p>
				)}
			</div>

			<form id="order-form" onSubmit={handleSubmit}>
				<button type="submit" className="btn btn-success w-100 mt-3">
					Confirmer la commande
				</button>
			</form>
		</div>
	)
}
