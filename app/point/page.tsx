import { prisma } from "../lib/prisma";
import { RequerantsDuJourTable } from "./RequerantsDuJourTable";
import { RequerantsParDateTable } from "./RequerantsParDateTable";

export const dynamic = "force-dynamic";

function startOfLocalDay(d: Date) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

function endOfLocalDay(d: Date) {
	const x = new Date(d);
	x.setHours(23, 59, 59, 999);
	return x;
}

export default async function Page() {
	const now = new Date();
	const jourDebut = startOfLocalDay(now);
	const jourFin = endOfLocalDay(now);

	const [nombreRequerants, aggregate, recusDuJour, recusTous] = await Promise.all([
		prisma.recu.count(),
		prisma.recu.aggregate({ _sum: { montant: true } }),
		prisma.recu.findMany({
			where: {
				date: {
					gte: jourDebut,
					lte: jourFin,
				},
			},
			include: { beneficiaire: true, numero: true },
			orderBy: { date: "asc" },
		}),
		prisma.recu.findMany({
			include: { beneficiaire: true, numero: true },
			orderBy: [{ date: "asc" }, { beneficiaire: { nom_complet: "asc" } }],
		}),
	]);

	const montantTotal = aggregate._sum.montant ?? 0;

	const parBeneficiaire = new Map<
		string,
		{ nom: string; contact: string; montantPaye: number; numero: string }
	>();
	for (const recu of recusDuJour) {
		const id = recu.beneficiaireId;
		const prev = parBeneficiaire.get(id);
		if (prev) {
			prev.montantPaye += recu.montant;
			// Keep the latest receipt number of the day for printing.
			prev.numero = recu.numero.numero;
		} else {
			parBeneficiaire.set(id, {
				nom: recu.beneficiaire.nom_complet,
				contact: recu.beneficiaire.telephone,
				montantPaye: recu.montant,
				numero: recu.numero.numero,
			});
		}
	}

	const rowsRequerantsDuJour = Array.from(parBeneficiaire.entries()).map(
		([beneficiaireId, v]) => ({
			beneficiaireId,
			nom: v.nom,
			contact: v.contact,
			montantPaye: v.montantPaye,
			numero: v.numero,
		}),
	);

	const rowsTousParDate = recusTous.map((recu) => ({
		recuId: recu.id,
		dat: new Date(recu.date).toLocaleDateString("fr-FR"),
		beneficiaireId: recu.beneficiaireId,
		nom: recu.beneficiaire.nom_complet,
		contact: recu.beneficiaire.telephone,
		montantPaye: recu.montant,
		numero: recu.numero.numero,
	}));

	const totalTousParDate = recusTous.reduce((sum, r) => sum + r.montant, 0);

	return (
		<main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fb923c_40%,#7c2d12_100%)] px-4 py-6 sm:px-6 lg:px-10">
			<section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
				<div className="w-full overflow-hidden rounded-4xl border border-white/25 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
					<div className="relative overflow-hidden rounded-[1.75rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,247,237,0.78)_45%,rgba(255,237,213,0.72)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_30px_80px_rgba(120,53,15,0.18)] sm:p-10 lg:p-12">
						<div className="absolute inset-0 bg-[linear-gradient(rgba(120,53,15,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(120,53,15,0.12)_1px,transparent_1px)] bg-size-[34px_34px] opacity-20" />
						<div className="absolute inset-x-8 top-0 h-px bg-white/70" />

						<div className="relative flex flex-col gap-8">
							<header className="flex flex-col ">
								<div className="flex flex-col justify-between items-center">
									<div className="flex items-center justify-between w-full">
										<div className="inline-flex rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm">
											<p>Nombre de bénéficiaires :</p>
											<p>{nombreRequerants}</p>
										</div>
										<div className="inline-flex rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm">
											<p>Montant total collecté :</p>
											<p>{montantTotal.toLocaleString("fr-FR")} F CFA</p>
										</div>
									</div>
									<h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-black sm:text-4xl">
										Liste des Bénéficiaires
									</h1>
								</div>
							</header>

							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2 text-black text-xl uppercase">
									Bénéficiaires du jour
								</div>
								<div className="flex flex-col gap-2">
									<RequerantsDuJourTable rows={rowsRequerantsDuJour} />
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-2 text-black text-xl  uppercase">
									Liste de tous les bénéficiaires par date de paiement
								</div>
								<div className="flex flex-col gap-2">
									<RequerantsParDateTable
										rows={rowsTousParDate}
										totalMontant={totalTousParDate}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
