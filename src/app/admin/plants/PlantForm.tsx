"use client"
import { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

type Plant = {
	id?: number
	name: string
	price: number
	description: string
	stock: number
}

type Props = {
	plantId?: string
}

export default function PlantForm({ plantId }: Props) {
	const router = useRouter()
	const [form, setForm] = useState<Plant>({
		name: "",
		price: 0,
		description: "",
		stock: 0
	})
	const [errors, setErrors] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!plantId) return
		fetch(`/api/plants/${plantId}`)
			.then(res => res.json())
			.then(data => {
				setForm({
					name: data.name || "",
					price: data.price || 0,
					description: data.description || "",
					stock: data.stock || 0
				})
			})
	}, [plantId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setForm(prev => ({
			...prev,
			[name]: name === "price" || name === "stock" ? Number(value) : value
		}))
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setErrors([])

		const method = plantId ? "PUT" : "POST"
		const url = plantId ? `/api/plants/${plantId}` : "/api/plants"

		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form)
		})

		setLoading(false)

		if (res.ok) {
			router.push("/admin/plants")
		} else {
			const data = await res.json()
			setErrors(data.errors || ["Erreur lors de la sauvegarde."])
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{errors.length > 0 && (
				<div className="alert alert-danger">
					<ul>
						{errors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				</div>
			)}

			<div className="mb-3">
				<label htmlFor="name" className="form-label">
					Nom de la plante
				</label>
				<input
					type="text"
					id="name"
					name="name"
					className="form-control"
					value={form.name}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="price" className="form-label">
					Prix (€)
				</label>
				<input
					type="number"
					id="price"
					name="price"
					className="form-control"
					value={form.price}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="description" className="form-label">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					rows={4}
					className="form-control"
					value={form.description}
					onChange={handleChange}
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="stock" className="form-label">
					Stock (unités)
				</label>
				<input
					type="number"
					id="stock"
					name="stock"
					className="form-control"
					value={form.stock}
					onChange={handleChange}
					required
				/>
			</div>
			<button type="submit" disabled={loading} className="btn btn-primary">
				{plantId ? "Mettre à jour" : "Créer"}
			</button>
		</form>
	)
}
