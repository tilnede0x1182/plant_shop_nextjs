// # Importations
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import OrderNewPageClient from "./OrderNewPageClient"

// # Main
export default async function OrderNewPageWrapper() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return <p className="alert alert-danger">Utilisateur non connecté.</p>
	}

	return <OrderNewPageClient userId={Number(userId)} />
}
