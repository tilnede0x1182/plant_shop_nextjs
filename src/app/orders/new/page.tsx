"use client"
import { useEffect, useState, FormEvent } from "react"

export default function OrderNewPage() {
	const [cartItems, setCartItems] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [alert, setAlert] = useState("")

	useEffect(() => {
		// Simulation de récupération du panier depuis localStorage ou contexte
		const stored = localStorage.getItem("cart")
		if (stored) setCartItems(JSON.parse(stored))
		setLoading(false)
	}, [])

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const items = cartItems.map(({ id, quantity }) => ({
			plant_id: id,
			quantity
		}))
		fetch("/api/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items })
		})
			.then(res => {
				if (res.ok) {
					localStorage.removeItem("cart")
					window.location.href = "/orders"
				} else {
					return res.json().then(data => {
						setAlert(data.message || "Erreur lors de la validation de la commande.")
					})
				}
			})
			.catch(() => setAlert("Erreur lors de la validation de la commande."))
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
					<ul>
						{cartItems.map(item => (
							<li key={item.id}>
								{item.name} × {item.quantity}
							</li>
						))}
					</ul>
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
