"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type User = {
	id: number
	email: string
	name?: string | null
}

export default function AdminUserShowPage() {
	const params = useParams()
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/users/${params.id}`)
			.then(res => res.json())
			.then(data => setUser(data))
	}, [params?.id])

	if (!user) return <p>Chargement...</p>

	const handleDelete = async () => {
		if (!confirm("Supprimer cet utilisateur ?")) return
		await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
		router.push("/admin/users")
	}

	return (
		<div className="container mt-4">
			{user.name && <h1><strong>Nom :</strong> {user.name}</h1>}
			<p><strong>Email :</strong> {user.email}</p>
			<Link href={`/admin/users/${user.id}/edit`} className="btn btn-warning">
				Modifier
			</Link>
			<button
				className="btn btn-danger btn-sm ms-2"
				onClick={handleDelete}
			>
				🗑 Supprimer
			</button>
		</div>
	)
}
