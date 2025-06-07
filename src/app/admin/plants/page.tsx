"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

type Plant = {
	id: number
	name: string
	price: number
	stock: number
}

export default function AdminPlantsPage() {
	const [plants, setPlants] = useState<Plant[]>([])

	useEffect(() => {
		fetch("/api/admin/plants")
			.then(res => res.json())
			.then(data => setPlants(data))
	}, [])

	return (
		<div className="container mt-4">
			<h1 className="mb-4">Gestion des Plantes</h1>
			<div className="mb-3">
				<Link href="/admin/plants/new" className="btn btn-outline-info">
					Nouvelle Plante
				</Link>
			</div>
			<table className="table table-striped table-hover">
				<thead className="table-light">
					<tr>
						<th>Nom</th>
						<th>Prix</th>
						<th>Stock</th>
						<th className="text-center">Actions</th>
					</tr>
				</thead>
				<tbody>
					{plants.map(plant => (
						<tr key={plant.id}>
							<td>
								<Link href={`/plants/${plant.id}`} className="text-decoration-none text-dark">
									{plant.name}
								</Link>
							</td>
							<td>{plant.price} €</td>
							<td>{plant.stock}</td>
							<td className="text-center">
								<div className="d-flex justify-content-center gap-2">
									<Link
										href={`/admin/plants/${plant.id}/edit`}
										className="btn btn-warning btn-sm"
									>
										✏ Modifier
									</Link>
									<button
										className="btn btn-danger btn-sm"
										onClick={async () => {
											if (!confirm("Supprimer cette plante ?")) return
											await fetch(`/api/admin/plants/${plant.id}`, { method: "DELETE" })
											setPlants(plants.filter(p => p.id !== plant.id))
										}}
									>
										🗑 Supprimer
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
