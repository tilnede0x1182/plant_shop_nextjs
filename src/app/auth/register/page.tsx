"use client"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [name, setName] = useState("")
	const [password, setPassword] = useState("")
	const [passwordConfirmation, setPasswordConfirmation] = useState("")
	const [error, setError] = useState("")

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		if (password !== passwordConfirmation) {
			setError("Passwords do not match")
			return
		}
		const res = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, name, password })
		})
		if (!res.ok) {
			const data = await res.json()
			setError(data.message || "Registration failed")
		} else {
			router.push("/auth/signin")
		}
	}

	return (
		<div className="container mt-4">
			<h1>S'inscrire</h1>
			<form onSubmit={handleSubmit} className="mt-3">
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email
					</label>
					<input
						id="email"
						type="email"
						className="form-control"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Nom
					</label>
					<input
						id="name"
						type="text"
						className="form-control"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Mot de passe
					</label>
					<input
						id="password"
						type="password"
						className="form-control"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="passwordConfirmation" className="form-label">
						Confirmation
					</label>
					<input
						id="passwordConfirmation"
						type="password"
						className="form-control"
						value={passwordConfirmation}
						onChange={e => setPasswordConfirmation(e.target.value)}
						required
					/>
				</div>
				{error && <div className="alert alert-danger">{error}</div>}
				<button type="submit" className="btn btn-primary">
					S'inscrire
				</button>
			</form>
		</div>
	)
}
