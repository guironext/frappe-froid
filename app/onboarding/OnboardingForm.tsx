"use client"

import { useUser } from "@clerk/nextjs"
import { useActionState } from "react"
import type { OnboardingState } from "./actions"
import { saveOnboarding } from "./actions"

const initialState: OnboardingState = { status: "idle" }

export function OnboardingForm() {
	const { user, isLoaded } = useUser()
	const [state, formAction, isPending] = useActionState(saveOnboarding, initialState)

	const email =
		user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress ?? ""

	return (
		<form action={formAction} className="flex w-full max-w-md flex-col gap-5 text-left">
			{state.status === "error" ? (
				<p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
					{state.message}
				</p>
			) : null}

			<label className="grid gap-2">
				<span className="text-sm font-semibold text-zinc-900">Prénom</span>
				<input
					name="prenom"
					required
					autoComplete="given-name"
					className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/80 px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-200/60"
					placeholder="Ex: Marie"
				/>
			</label>

			<label className="grid gap-2">
				<span className="text-sm font-semibold text-zinc-900">Nom</span>
				<input
					name="nom"
					required
					autoComplete="family-name"
					className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/80 px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-200/60"
					placeholder="Ex: Martin"
				/>
			</label>

			<div className="grid gap-2">
				<span className="text-sm font-semibold text-zinc-900">E-mail</span>
				<p className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/50 px-4 py-3 text-left text-sm text-zinc-700">
					{!isLoaded ? "Chargement…" : email || "—"}
				</p>
			</div>

			<button
				type="submit"
				disabled={isPending}
				className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
			>
				{isPending ? "Enregistrement…" : "Continuer"}
			</button>
		</form>
	)
}
