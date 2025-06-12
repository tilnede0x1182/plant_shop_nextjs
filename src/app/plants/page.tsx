"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Plant = {
	id: number;
	name: string;
	price: number;
	description?: string;
	stock: number;
};

type Cart = {
	add: (id: number, name: string, price: number, stock: number) => void;
};

export default function PlantsPage() {
	const [plants, setPlants] = useState<Plant[]>([]);
	const [isAdmin, setIsAdmin] = useState(false);

	// Récupérer plantes et rôle utilisateur (admin) au montage
	useEffect(() => {
		// Récupérer les plantes
		fetch("/api/plants")
			.then((res) => res.json())
			.then((data) => setPlants(data));

		// Récupérer session / rôle admin (simplifié)
		fetch("/api/auth/session")
			.then((res) => res.json())
			.then((session) => setIsAdmin(session?.user?.admin ?? false));
	}, []);

	return (
		<>
			<h1 className="text-center mb-4">🌿 Liste des Plantes</h1>
			{isAdmin && (
				<Link href="/admin/plants/new" className="btn btn-success mb-3">
					Nouvelle Plante
				</Link>
			)}
			<div className="row">
				{plants.map((plant) => (
					<div className="col-md-4" key={plant.id}>
						<div className="card mb-4 shadow-sm">
							<div className="card-body">
								<h5 className="card-title">
									<Link
										href={`/plants/${plant.id}`}
										className="text-decoration-none text-dark"
									>
										{plant.name}
									</Link>
								</h5>
								<p className="card-text">
									<strong>Prix :</strong> {plant.price} €
									<br />
									{isAdmin && (
										<>
											<strong>Stock :</strong>{" "}
											{plant.stock} unités
										</>
									)}
								</p>
								<button
									className="btn btn-success w-100"
									onClick={() => {
										const win = window as unknown as {
											cartInstance?: Cart;
										};
										if (
											typeof window !== "undefined" &&
											win.cartInstance
										) {
											win.cartInstance.add(
												plant.id,
												plant.name,
												plant.price,
												plant.stock
											);
										}
									}}
								>
									Ajouter au panier
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
