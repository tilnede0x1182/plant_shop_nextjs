"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

type User = {
	id: number
	name: string
	email: string
	admin: boolean
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		fetch("/api/users")
			.then(res => res.json())
			.then(data => setUsers(data))
	}, [])

	return (
		<div className="container mt-4">
			<h1 className="mb-4">Gestion des Utilisateurs</h1>
			<table className="table table-striped table-hover">
				<thead className="table-light">
					<tr>
						<th>Nom</th>
						<th>Email</th>
						<th>Administrateur</th>
						<th className="text-center">Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id}>
							<td>
								<Link
									href={`/admin/users/${user.id}`}
									className="text-decoration-none text-dark"
								>
									{user.name}
								</Link>
							</td>
							<td>{user.email}</td>
							<td>
								<span className={`badge ${user.admin ? "bg-success" : "bg-secondary"}`}>
									{user.admin ? "Oui" : "Non"}
								</span>
							</td>
							<td className="text-center">
								<div className="d-flex justify-content-center gap-2">
									<Link
										href={`/admin/users/${user.id}/edit`}
										className="btn btn-warning btn-sm"
									>
										✏ Modifier
									</Link>
									<button
										className="btn btn-danger btn-sm"
										onClick={async () => {
											if (!confirm("Supprimer cet utilisateur ?")) return
											await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
											setUsers(users.filter(u => u.id !== user.id))
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
