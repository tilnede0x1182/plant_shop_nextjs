"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Plant = {
	id: number
	name: string
	price: number
	description?: string
	stock: number
}

export default function PlantShowPage() {
	const params = useParams()
	const router = useRouter()
	const [plant, setPlant] = useState<Plant | null>(null)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/plants/${params.id}`)
			.then(res => res.json())
			.then(data => setPlant(data))

		fetch("/api/auth/session")
			.then(res => res.json())
			.then(session => setIsAdmin(session?.user?.admin ?? false))
	}, [params?.id])

	const addToCart = (id: number, name: string, price: number) => {
		// TODO: Implémenter la logique d'ajout au panier
		alert(`Ajouter au panier : ${name} (${id}), prix : ${price} €`)
	}

	if (!plant) return <p>Chargement...</p>

	return (
		<div className="card shadow-lg">
			<div className="card-body">
				<h1 className="card-title">{plant.name}</h1>
				<p><strong>Prix :</strong> {plant.price} €</p>
				<p><strong>Description :</strong> {plant.description}</p>
				{isAdmin && <p><strong>Stock :</strong> {plant.stock} unités</p>}
				<div className="d-flex flex-wrap gap-2 mb-2">
					<button
						className="btn btn-success"
						onClick={() => addToCart(plant.id, plant.name, plant.price)}
					>
						Ajouter au panier
					</button>
					{isAdmin && (
						<>
							<Link href={`/admin/plants/${plant.id}/edit`} className="btn btn-warning">
								Modifier
							</Link>
							<form
								action={`/api/admin/plants/${plant.id}`}
								method="POST"
								onSubmit={e => {
									e.preventDefault()
									if (!confirm("Supprimer cette plante ?")) return
									fetch(`/api/admin/plants/${plant.id}`, {
										method: "DELETE"
									}).then(() => router.push("/plants"))
								}}
								className="d-inline"
							>
								<button type="submit" className="btn btn-danger">
									Supprimer
								</button>
							</form>
						</>
					)}
				</div>
				<div className="mt-3">
					<Link href="/plants" className="btn btn-secondary">
						Retour à la liste
					</Link>
				</div>
			</div>
		</div>
	)
}
