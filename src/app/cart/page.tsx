"use client"
import { useEffect, useState } from "react"

export default function CartPage() {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Simulation du chargement du panier, ex. depuis localStorage
		setTimeout(() => setLoading(false), 500)
	}, [])

	return (
		<div className="container mt-4">
			<h1 className="text-center mb-4">🛒 Mon Panier</h1>
			<div id="cart-container">
				{loading ? (
					<p className="alert alert-info">Chargement du panier...</p>
				) : (
					<p>Votre panier est vide.</p> /* Placeholder, à remplacer par contenu réel */
				)}
			</div>
		</div>
	)
}
