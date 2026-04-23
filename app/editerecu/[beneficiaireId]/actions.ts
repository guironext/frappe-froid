"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { prisma } from "../../lib/prisma"

export type EditBeneficiaireState =
	| { status: "idle" }
	| { status: "success" }
	| { status: "error"; message: string }

export async function updateBeneficiaire(
	beneficiaireId: string,
	_prevState: EditBeneficiaireState,
	formData: FormData,
): Promise<EditBeneficiaireState> {
	const { userId } = await auth()
	if (!userId) {
		return { status: "error", message: "Connectez-vous pour modifier." }
	}

	const nom_complet = String(formData.get("nom_complet") ?? "").trim()
	const telephone = String(formData.get("telephone") ?? "").trim()

	if (!nom_complet || !telephone) {
		return { status: "error", message: "Veuillez remplir le nom complet et le téléphone." }
	}

	try {
		await prisma.beneficiaire.update({
			where: { id: beneficiaireId },
			data: { nom_complet, telephone },
		})
		revalidatePath("/point")
		revalidatePath("/editerecu")
		return { status: "success" }
	} catch {
		return {
			status: "error",
			message: "Impossible d'enregistrer les modifications.",
		}
	}
}
