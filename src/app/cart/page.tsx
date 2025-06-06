"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
	return (
		<div className="container mt-4">
			<h1 className="text-center mb-4">🛒 Mon Panier</h1>
			<div id="cart-container">
				<p className="alert alert-info">Initialisation du panier…</p>
			</div>
		</div>
	);
}
