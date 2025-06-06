import './globals.css'
import '../../public/stylesheets/application.css'
import Navbar from './components/Navbar'

export const metadata = {
	title: 'Magasin de Plantes'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Magasin de Plantes</title>
				{/* Icône du site */}
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				{/* Bootstrap CSS preload pour optimisation */}
				<link
					rel="preload"
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
					as="style"
					onLoad="this.rel='stylesheet'"
				/>
				{/* Fallback si JavaScript désactivé */}
				<noscript>
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
					/>
				</noscript>
			</head>
			<body>
				{/* Barre de navigation */}
				<Navbar />
				{/* Container principal */}
				<div className="container mt-4">
					{/* TODO: Flash messages React component */}
					{children}
				</div>
				{/* Bootstrap JS bundle */}
				<script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
					defer
				/>
				{/* Application JS hérité de Rails */}
				<script src="/javascripts/application.js" defer />
			</body>
		</html>
	)
}
