"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, FormEvent } from "react"

type PlantForm = {
	name: string
	price: number
	description: string
	stock: number
}

export default function PlantEditPage() {
	const params = useParams()
	const router = useRouter()
	const [form, setForm] = useState<PlantForm>({
		name: "",
		price: 0,
		description: "",
		stock: 0
	})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/plants/${params.id}`)
			.then(res => res.json())
			.then(data => {
				setForm({
					name: data.name || "",
					price: data.price || 0,
					description: data.description || "",
					stock: data.stock || 0
				})
				setLoading(false)
			})
	}, [params?.id])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: name === "price" || name === "stock" ? Number(value) : value }))
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!params?.id) return
		await fetch(`/api/plants/${params.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form)
		})
		router.push(`/plants/${params.id}`)
	}

	if (loading) return <p>Chargement...</p>

	return (
		<div className="container mt-4">
			<h1 className="mb-4">Modifier la plante 🛠️</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">Nom de la plante</label>
					<input id="name" name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
				</div>
				<div className="mb-3">
					<label htmlFor="price" className="form-label">Prix (€)</label>
					<input id="price" name="price" type="number" className="form-control" value={form.price} onChange={handleChange} required />
				</div>
				<div className="mb-3">
					<label htmlFor="description" className="form-label">Description</label>
					<textarea id="description" name="description" rows={5} className="form-control" value={form.description} onChange={handleChange} />
				</div>
				<div className="mb-3">
					<label htmlFor="stock" className="form-label">Stock</label>
					<input id="stock" name="stock" type="number" className="form-control" value={form.stock} onChange={handleChange} required />
				</div>
				<button type="submit" className="btn btn-primary w-100">Mettre à jour</button>
			</form>
		</div>
	)
}
