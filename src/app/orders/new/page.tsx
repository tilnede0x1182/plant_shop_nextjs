"use client";
import { useEffect, useState, FormEvent } from "react";

export default function OrderNewPage() {
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [alert, setAlert] = useState("");

	useEffect(() => {
		// Récupérer le panier depuis localStorage, puis le normaliser en tableau
		const stored = localStorage.getItem("cart");
		if (stored) {
			let parsed = JSON.parse(stored);
			// Si c'est un objet, prendre ses valeurs ; si c'est déjà un tableau, le garder tel quel
			if (
				!Array.isArray(parsed) &&
				typeof parsed === "object" &&
				parsed !== null
			) {
				parsed = Object.values(parsed);
			}
			setCartItems(parsed);
		}
		setLoading(false);
	}, []);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const items = cartItems.map(({ id, quantity }) => ({
			plant_id: id,
			quantity,
		}));
		const userId = 1; // à remplacer par l’ID user réel si besoin
		const res = await fetch("/api/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ items, userId }),
		});
		if (res.ok) {
			localStorage.removeItem("cart");
			window.location.href = "/orders";
		} else {
			const data = await res.json();
			setAlert(
				data.message || "Erreur lors de la validation de la commande."
			);
		}
	}

	if (loading)
		return (
			<p className="alert alert-info">Chargement de votre panier...</p>
		);

	return (
		<div>
			<h1 className="text-center mb-4">Valider ma commande</h1>

			{alert && <div className="alert alert-danger">{alert}</div>}

			<div id="order-review-container">
				{cartItems.length === 0 ? (
					<p className="alert alert-info">Votre panier est vide.</p>
				) : (
					<ul>
						{cartItems.map((item) => (
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
	);
}
