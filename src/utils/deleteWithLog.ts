/**
  Supprime un enregistrement avec gestion log, pour réutilisation dans les handlers.
  @prisma le client Prisma à utiliser
  @type "plant" | "user"
  @id identifiant numérique à supprimer
*/
import { PrismaClient } from "@prisma/client";

export async function deleteWithLog(
	prisma: Pick<PrismaClient, "plant" | "user">,
	type: "plant" | "user",
	id: number
) {
	try {
		if (type === "plant") {
			await prisma.plant.delete({ where: { id } });
			// console.log(`Suppression réussie plante id=${id}`)
		} else if (type === "user") {
			await prisma.user.delete({ where: { id } });
			// console.log(`Suppression réussie utilisateur id=${id}`)
		} else {
			// throw new Error("Type de suppression non supporté")
		}
		return { ok: true };
	} catch (error) {
		console.error(`Erreur suppression ${type} id=${id}:`, error);
		return { ok: false, error };
	}
}
