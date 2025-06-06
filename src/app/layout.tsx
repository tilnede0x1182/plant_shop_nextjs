import Navbar from './components/Navbar'
import { Providers } from './providers'
import CartProvider from './components/CartProvider'

export const metadata = {
	title: 'Magasin de Plantes'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning={true}>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Magasin de Plantes</title>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
				<link rel="stylesheet" href="/stylesheets/application.css" />
			</head>
			<body>
				<Providers>
					<Navbar />
					<CartProvider />
					<div className="container mt-4">
						{children}
					</div>
				</Providers>
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" />
				{/* <script src="/javascripts/application.js" /> */}
				{/* <script src="/javascripts/application.js"></script> */}
			</body>
		</html>
	)
}
