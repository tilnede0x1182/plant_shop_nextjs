"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function FlashMessages() {
	const [notice, setNotice] = useState<string | null>(null)
	const [alert, setAlert] = useState<string | null>(null)
	const router = useRouter()

	useEffect(() => {
		// Exemple : lire messages depuis sessionStorage ou autre source
		const n = sessionStorage.getItem("notice")
		const a = sessionStorage.getItem("alert")
		if (n) {
			setNotice(n)
			sessionStorage.removeItem("notice")
		}
		if (a) {
			setAlert(a)
			sessionStorage.removeItem("alert")
		}

		// Effacer messages à chaque navigation
		return router.events.on("routeChangeStart", () => {
			setNotice(null)
			setAlert(null)
		})
	}, [router.events])

	if (!notice && !alert) return null

	return (
		<>
			{notice && <div className="alert alert-success">{notice}</div>}
			{alert && <div className="alert alert-danger">{alert}</div>}
		</>
	)
}
