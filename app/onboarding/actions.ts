"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "../lib/prisma"

export type OnboardingState =
	| { status: "idle" }
	| { status: "error"; message: string }

export async function saveOnboarding(
	_prev: OnboardingState,
	formData: FormData,
): Promise<OnboardingState> {
	const { userId } = await auth()
	if (!userId) {
		redirect("/sign-in")
	}

	const clerkUser = await currentUser()
	const email =
		clerkUser?.primaryEmailAddress?.emailAddress ??
		clerkUser?.emailAddresses[0]?.emailAddress

	if (!email) {
		return {
			status: "error",
			message:
				"Aucune adresse e-mail n'est associée à votre compte. Complétez votre profil Clerk.",
		}
	}

	const nom = String(formData.get("nom") ?? "").trim()
	const prenom = String(formData.get("prenom") ?? "").trim()

	if (!nom || !prenom) {
		return {
			status: "error",
			message: "Veuillez remplir le nom et le prénom.",
		}
	}

	try {
		await prisma.user.upsert({
			where: { email },
			create: { email, nom, prenom },
			update: { nom, prenom, updatedAt: new Date() },
		})
	} catch (err) {
		console.error("saveOnboarding", err)
		return {
			status: "error",
			message: "Impossible d'enregistrer vos informations. Réessayez dans un instant.",
		}
	}

	redirect("/recus")
}
