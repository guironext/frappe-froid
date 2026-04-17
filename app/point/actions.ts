"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "../lib/prisma"

export async function deleteBeneficiaire(beneficiaireId: string) {
	const recus = await prisma.recu.findMany({
		where: { beneficiaireId },
		select: { id: true, numeroId: true },
	})

	await prisma.$transaction(async (tx) => {
		for (const recu of recus) {
			await tx.recu.delete({ where: { id: recu.id } })
			await tx.numero.delete({ where: { id: recu.numeroId } })
		}
		await tx.beneficiaire.delete({ where: { id: beneficiaireId } })
	})

	revalidatePath("/point")
	revalidatePath("/editerecu")
}
