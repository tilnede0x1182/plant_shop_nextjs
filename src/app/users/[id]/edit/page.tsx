"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, FormEvent } from "react"

type UserForm = {
	email: string
	name: string
}

type Errors = string[]

export default function UserEditPage() {
	const params = useParams()
	const router = useRouter()
	const [form, setForm] = useState<UserForm>({ email: "", name: "" })
	const [errors, setErrors] = useState<Errors>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/users/${params.id}`)
			.then(res => res.json())
			.then(data => {
				setForm({ email: data.email || "", name: data.name || "" })
				setLoading(false)
			})
	}, [params?.id])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setForm(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!params?.id) return
		const res = await fetch(`/api/users/${params.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form)
		})
		if (res.ok) {
			router.push(`/users/${params.id}`)
			window.location.reload();
		} else {
			const data = await res.json()
			setErrors(data.errors || ["Échec de la mise à jour de l'utilisateur."])
		}
	}

	if (loading) return <p>Chargement...</p>

	return (
		<div className="container mt-4">
			<h1>Modifier mon profil</h1>

			{errors.length > 0 && (
				<div className="alert alert-danger">
					<ul>
						{errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						className="form-control"
						value={form.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Nom
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className="form-control"
						value={form.name}
						onChange={handleChange}
					/>
				</div>
				<button type="submit" className="btn btn-primary">
					Enregistrer
				</button>
			</form>
		</div>
	)
}
