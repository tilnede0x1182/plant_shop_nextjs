"use client"
import PlantForm from "../../PlantForm"
import { useParams } from "next/navigation"

export default function AdminPlantEditPage() {
	const params = useParams()
	return (
		<div className="container mt-4">
			<h1>Éditer la Plante</h1>
			<PlantForm plantId={params?.id} />
		</div>
	)
}
