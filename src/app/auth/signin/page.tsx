"use client"
import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password
		})
		if (res?.error) setError("Invalid email or password")
		else router.push("/")
	}

	return (
		<div className="container mt-4">
			<h1>Se Connecter</h1>
			<form onSubmit={handleSubmit} className="mt-3 w-100" style={{ maxWidth: '500px' }}>
				<div className="mb-3">
					<label className="form-label">Email</label>
					<input
						type="email"
						className="form-control"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Mot de passe</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <div className="alert alert-danger">{error}</div>}
				<button type="submit" className="btn btn-primary">
					Se connecter
				</button>
			</form>
		</div>
	)
}
