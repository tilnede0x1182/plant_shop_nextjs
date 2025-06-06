// src/app/components/Navbar.tsx

"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import dynamic from "next/dynamic";

const CartLink = dynamic(
	() =>
		Promise.resolve(function CartLink() {
			return (
				<a href="/cart" className="nav-link" id="cart-link">
					Mon Panier
				</a>
			);
		}),
	{ ssr: false }
);

// Navbar avec gestion utilisateur et rôle admin
export default function Navbar() {
	const { data: session } = useSession();
	const user = session?.user;

	const isAdmin = user?.admin === true;

	const capitalizeName = (name?: string) =>
		name
			? name
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
					.join(" ")
			: "";

	return (
		<nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
			<div className="container">
				<Link href="/" className="navbar-brand">
					🌿 PlantShop
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						{user && user.name && (
							<li className="nav-item d-flex align-items-center text-white me-3">
								{capitalizeName(user.name)}
								{isAdmin && " (Administrateur)"}
							</li>
						)}
						<li className="nav-item">
							<CartLink />
						</li>
						{user ? (
							<>
								<li className="nav-item">
									<Link href="/orders" className="nav-link">
										Mes Commandes
									</Link>
								</li>
								<li className="nav-item">
									<Link href={`/users/${user.id}`} className="nav-link">
										Mon Profil
									</Link>
								</li>
								{isAdmin && (
									<li className="nav-item dropdown">
										<a
											className="nav-link dropdown-toggle"
											href="#"
											role="button"
											data-bs-toggle="dropdown"
										>
											Admin
										</a>
										<ul className="dropdown-menu">
											<li>
												<Link href="/admin/plants" className="dropdown-item">
													Gestion des Plantes
												</Link>
											</li>
											<li>
												<Link href="/admin/users" className="dropdown-item">
													Gestion des Utilisateurs
												</Link>
											</li>
										</ul>
									</li>
								)}
								<li className="nav-item">
									<button
										onClick={() => signOut()}
										className="nav-link btn btn-link"
										style={{ padding: 0, border: "none" }}
									>
										Déconnexion
									</button>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link href="/auth/register" className="nav-link">
										S'inscrire
									</Link>
								</li>
								<li className="nav-item">
									<Link href="/auth/signin" className="nav-link">
										Se connecter
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}
