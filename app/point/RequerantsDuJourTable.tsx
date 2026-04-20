"use client"

import type { SVGProps } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import * as XLSX from "xlsx"
import { deleteBeneficiaire } from "./actions"

export type RequerantDuJourRow = {
	beneficiaireId: string
	nom: string
	contact: string
	montantPaye: number
	numero: string
}

function IconPrint(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			{...props}
		>
			<path d="M6 9V2h12v7" />
			<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
			<path d="M6 14h12v8H6z" />
		</svg>
	)
}

function IconEdit(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			{...props}
		>
			<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
			<path d="m15 5 4 4" />
		</svg>
	)
}

function IconTrash(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			{...props}
		>
			<path d="M3 6h18" />
			<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
			<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
			<line x1="10" x2="10" y1="11" y2="17" />
			<line x1="14" x2="14" y1="11" y2="17" />
		</svg>
	)
}

function IconFileExcel(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			{...props}
		>
			<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
			<path d="M14 3v6h6" />
			<path d="m9 13 6 6" />
			<path d="m15 13-6 6" />
		</svg>
	)
}

export function RequerantsDuJourTable({ rows }: { rows: RequerantDuJourRow[] }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	function handleExportExcel() {
		if (rows.length === 0) {
			toast.error("Aucune donnée à exporter.")
			return
		}

		try {
			const totalMontant = rows.reduce((acc, row) => acc + row.montantPaye, 0)

			const data = rows.map((row) => ({
				"N° Reçu": row.numero,
				Nom: row.nom,
				Contact: row.contact,
				"Montant payé (F CFA)": row.montantPaye,
			}))

			data.push({
				"N° Reçu": "",
				Nom: "TOTAL",
				Contact: "",
				"Montant payé (F CFA)": totalMontant,
			})

			const worksheet = XLSX.utils.json_to_sheet(data)
			worksheet["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 20 }, { wch: 20 }]

			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "Réquérants du jour")

			const today = new Date()
			const yyyy = today.getFullYear()
			const mm = String(today.getMonth() + 1).padStart(2, "0")
			const dd = String(today.getDate()).padStart(2, "0")
			const filename = `requerants-du-jour-${yyyy}-${mm}-${dd}.xlsx`

			XLSX.writeFile(workbook, filename)
			toast.success("Export Excel réussi")
		} catch {
			toast.error("Impossible d'exporter le fichier Excel.")
		}
	}

	function handleDelete(beneficiaireId: string, nom: string) {
		if (!window.confirm(`Supprimer le réquérant « ${nom} » et ses reçus associés ?`)) {
			return
		}
		startTransition(async () => {
			try {
				await deleteBeneficiaire(beneficiaireId)
				toast.success("Réquérant supprimé")
				router.refresh()
			} catch {
				toast.error("Impossible de supprimer ce réquérant.")
			}
		})
	}

	if (rows.length === 0) {
		return (
			<p className="rounded-2xl border border-white/50 bg-white/40 px-4 py-6 text-center text-sm text-zinc-700">
				Aucun réquérant enregistré pour aujourd&apos;hui.
			</p>
		)
	}

	return (
		<div className="overflow-x-auto rounded-2xl border border-white/50 bg-white/50 shadow-inner">
			<div className="flex justify-between items-center gap-2">
				<div className="">
				</div>
				<button
					type="button"
					onClick={handleExportExcel}
					className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-50"
				>
					<IconFileExcel />
					Exporter vers Excel
				</button>
			</div>
			
				<div className="flex justify-between items-center gap-2">
					<p className="text-sm text-zinc-700">
						Nombre de réquérants du jour : <span className="font-bold">{rows.length}</span>
					</p>
					<p className="text-sm text-zinc-700">
						Montant total collecté du jour : <span className="font-bold">{rows.reduce((acc, row) => acc + row.montantPaye, 0).toLocaleString("fr-FR")} F CFA</span>
					</p>
				</div>
				
			
			<table className="w-full min-w-[min(100%,520px)] border-collapse text-left text-sm text-zinc-900">
				<thead>
					<tr className="border-b border-orange-200/80 bg-white/60 text-xs font-semibold uppercase tracking-wide text-orange-900">
						<th className="px-4 py-3">Nom</th>
						<th className="px-4 py-3">Contact</th>
						<th className="px-4 py-3 text-right">Montant payé</th>
						<th className="px-4 py-3 text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr
							key={row.beneficiaireId}
							className="border-b border-orange-100/80 last:border-0 hover:bg-white/70"
						>
							<td className="px-4 py-3 font-medium">{row.nom}</td>
							<td className="px-4 py-3 text-zinc-700">{row.contact}</td>
							<td className="px-4 py-3 text-right tabular-nums">
								{row.montantPaye.toLocaleString("fr-FR")} F CFA
							</td>
							<td className="px-4 py-3">
								<div className="flex items-center justify-center gap-2">
									<Link
										href={`/imprimer?numero=${encodeURIComponent(row.numero)}`}
										prefetch={false}
										className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/90 text-zinc-800 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
										aria-label={`Imprimer le reçu de ${row.nom}`}
									>
										<IconPrint />
									</Link>
									<Link
										href={`/editerecu/${row.beneficiaireId}`}
										prefetch={false}
										className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white/90 text-orange-700 shadow-sm transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
										aria-label={`Modifier ${row.nom}`}
									>
										<IconEdit />
									</Link>
									<button
										type="button"
										disabled={pending}
										onClick={() => handleDelete(row.beneficiaireId, row.nom)}
										className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white/90 text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
										aria-label={`Supprimer ${row.nom}`}
									>
										<IconTrash />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
