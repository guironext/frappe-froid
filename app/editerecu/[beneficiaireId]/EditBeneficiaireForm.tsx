"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { EditBeneficiaireState } from "./actions"

const initialState: EditBeneficiaireState = { status: "idle" }

export function EditBeneficiaireForm({
	action,
	defaultNom,
	defaultTelephone,
}: {
	action: (prevState: EditBeneficiaireState, formData: FormData) => Promise<EditBeneficiaireState>
	defaultNom: string
	defaultTelephone: string
}) {
	const router = useRouter()
	const [state, formAction, isPending] = useActionState<EditBeneficiaireState, FormData>(
		action,
		initialState,
	)

	useEffect(() => {
		if (state.status === "success") {
			toast.success("Modifications enregistrées")
			router.push("/point")
		} else if (state.status === "error") {
			toast.error(state.message)
		}
	}, [router, state])

	return (
		<form action={formAction} className="grid gap-5">
			<div className="grid gap-5 lg:grid-cols-2">
				<label className="grid gap-2">
					<span className="text-sm font-semibold text-zinc-900">Nom complet</span>
					<input
						name="nom_complet"
						required
						defaultValue={defaultNom}
						autoComplete="name"
						className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/80 px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-200/60"
					/>
				</label>

				<label className="grid gap-2">
					<span className="text-sm font-semibold text-zinc-900">Téléphone</span>
					<input
						name="telephone"
						required
						defaultValue={defaultTelephone}
						autoComplete="tel"
						className="min-h-12 w-full rounded-2xl border border-white/60 bg-white/80 px-4 text-sm text-zinc-950 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-200/60"
					/>
				</label>
			</div>

			<div className="flex flex-wrap justify-end gap-4">
				<button
					type="submit"
					disabled={isPending}
					className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
				>
					{isPending ? "Enregistrement..." : "Enregistrer"}
				</button>
			</div>
		</form>
	)
}
