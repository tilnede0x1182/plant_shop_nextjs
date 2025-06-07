"use client"
import { useEffect, useState, FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"

type UserForm = {
	email: string
	name: string
	admin: boolean
}

type Errors = string[]

export default function AdminUserEditPage() {
	const params = useParams()
	const router = useRouter()
	const [form, setForm] = useState<UserForm>({
		email: "",
		name: "",
		admin: false
	})
	const [errors, setErrors] = useState<Errors>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/users/${params.id}`)
			.then(res => res.json())
			.then(data => {
				setForm({
					email: data.email || "",
					name: data.name || "",
					admin: data.admin || false
				})
				setLoading(false)
			})
	}, [params?.id])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type, checked } = e.target
		setForm(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}))
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
			router.push("/admin/users")
		} else {
			const data = await res.json()
			setErrors(data.errors || ["Erreur lors de la mise à jour."])
		}
	}

	if (loading) return <p>Chargement...</p>

	return (
		<div className="container mt-4">
			<h1>Modifier l&apos;utilisateur</h1>

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
						id="email"
						name="email"
						type="email"
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
						id="name"
						name="name"
						type="text"
						className="form-control"
						value={form.name}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3 form-check">
					<input
						id="admin"
						name="admin"
						type="checkbox"
						className="form-check-input"
						checked={form.admin}
						onChange={handleChange}
					/>
					<label htmlFor="admin" className="form-check-label">
						Administrateur
					</label>
				</div>

				<button type="submit" className="btn btn-primary">
					Enregistrer
				</button>
			</form>
		</div>
	)
}
