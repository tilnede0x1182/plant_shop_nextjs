/**
  Supprime une ressource et vérifie en base via GET juste après.
  @param deleteUrl URL DELETE (API)
  @param checkUrl URL GET de vérification après suppression
  @param successCallback à exécuter sur vrai succès (ex : refresh UI)
*/
export async function deleteAndCheck(deleteUrl: string, checkUrl: string, successCallback: () => void) {
	const res = await fetch(deleteUrl, { method: "DELETE" })
	if (res.ok) {
		const check = await fetch(checkUrl)
		if (check.status === 404) {
			// console.log(`Suppression réussie : ${deleteUrl}`)
			successCallback()
		} else {
			// console.log(`Erreur : ressource ${deleteUrl} existe encore en base.`)
		}
	} else {
		const data = await res.json().catch(() => ({}))
		// console.log("Erreur suppression :", data.error || "erreur inconnue")
	}
}
