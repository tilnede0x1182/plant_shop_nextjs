"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type User = {
	id: number
	email: string
	name?: string | null
}

export default function UserProfilePage() {
	const params = useParams()
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		if (!params?.id) return
		fetch(`/api/users/${params.id}`)
			.then(res => res.json())
			.then(data => setUser(data))
	}, [params?.id])

	if (!user) return <p>Chargement...</p>

	return (
		<div className="container mt-4">
			<h1>Mon Profil</h1>
			{user.name && (
				<p>
					<strong>Nom :</strong> {user.name}
				</p>
			)}
			<p>
				<strong>Email :</strong> {user.email}
			</p>
			<Link href={`/users/${user.id}/edit`} className="btn btn-primary">
				Modifier mon profil
			</Link>
		</div>
	)
}
