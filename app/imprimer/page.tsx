import Image from "next/image";
import { PrintButton } from "./PrintButton";

export const dynamic = "force-dynamic";

/** Montant avec séparateurs fr-FR, ex. « 100 000 ». */
function formatMontant(amount: number): string {
	return new Intl.NumberFormat("fr-FR", {
		maximumFractionDigits: 0,
	})
		.format(amount)
		.replace(/\u202f/g, " ")
		.replace(/\u00a0/g, " ");
}

type RecuPourImpression = {
	montant: number;
	beneficiaire: { nom_complet: string; telephone: string };
	user: { nom: string; prenom: string };
};

function RecuSheet({
	recu,
	numero,
	datePaiement,
}: {
	recu: RecuPourImpression;
	numero: string;
	datePaiement: string;
}) {
	return (
		<div className="a5-print-sheet w-full overflow-hidden rounded-4xl bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl print:rounded-none print:bg-white print:p-3 print:shadow-none print:text-[11px] sm:p-8 lg:p-10">
			<div className="flex  justify-between">
				<div></div>

				<div className="text-right text-black text-xl italic print:text-sm">
					<p>Date de paiement : {datePaiement}</p>
				</div>
			</div>

			<div className="flex items-center justify-between p-4 print:p-2">
				<Image
					src="/logo.jpeg"
					alt="logo"
					width={150}
					height={150}
					className="h-[150px] w-[150px] object-contain print:h-[130px] print:w-[130px]"
				/>
				<div className=" text-black font-bold text-5xl gap-4 uppercase items-center justify-center print:text-4xl flex ">
					<h1>Reçu</h1>
					<h1 className="text-red-500  font-bold uppercase text-5xl print:text-4xl"> N° : {numero}</h1>
				</div>
				<Image
					src="/logo3.jpeg"
					alt="logo"
					width={150}
					height={150}
					className="h-[150px] w-[150px] object-contain print:h-[130px] print:w-[130px]"
				/>
			</div>

		
			<div className="flex w-full items-center justify-between">
				<div></div>
				<div className="text-red-500 text-xl font-bold uppercase"></div>
				<div className="text-black text-2xl font-bold uppercase bg-gray-200 p-4 leading-tight print:p-2 print:text-xl">
					<p>B.P.F : # {formatMontant(recu.montant)} #</p>
				</div>
			</div>
			<div className="flex w-full items-center justify-center mt-2 print:mt-2">
				<p className="text-black text-2xl font-bold uppercase px-10 text-center leading-tight print:px-6 print:text-xl">
					Opération spéciale véhicules hors taxe
				</p>
			</div>
			<div className="flex flex-col gap-2 w-full  justify-self-start mt-5 print:mt-3">
				<div className="text-black text-xl text-center font-bold uppercase flex items-center gap-2 print:text-lg">
					<p>M / Mme :</p>
					<p className="bg-gray-200 font-normal p-3 leading-tight print:p-1.5 print:text-base">
						{" "}
						{recu.beneficiaire.nom_complet}
					</p>
				</div>
				<div className="text-black text-lg text-center font-bold uppercase flex w-full items-center gap-2 print:text-base">
					<p>N° de téléphone :</p>
					<p className="bg-gray-200 p-3 font-normal leading-tight print:p-1.5 print:text-base">
						{" "}
						{recu.beneficiaire.telephone}
					</p>
				</div>
			</div>
			<div className="flex w-full items-center justify-center mt-4 print:mt-3">
				<div className="text-black text-xl text-center font-bold uppercase flex w-full items-center gap-2 print:text-lg">
					<p> La somme de :</p>
					<p className="uppercase text-black text-xl font-normal bg-gray-200 p-3 leading-tight print:p-1.5 print:text-base">
						cent mille francs CFA
					</p>
				</div>
			</div>
			<div className="text-black text-lg text-center font-bold uppercase flex w-full items-center gap-2 mt-4 print:mt-3 print:text-base">
				<p> Pour: </p>
				<p className="font-normal bg-gray-200 p-3">Frappe à Froid</p>
			</div>

			<div className="text-black text-2xl text-center font-bold uppercase flex w-full items-center justify-between gap-2 my-4 print:my-2 print:text-lg">
				<div className="flex flex-col items-center gap-2">
					<p className="font-normal bg-gray-200 p-3">Caissière :</p>
					<p className="font-normal text-black text-xl pt-2 text-center">
						{recu.user.prenom}
					</p>
				</div>
				<div className="flex flex-col items-center gap-2">
					<p className="font-normal bg-gray-200 p-3">Bénéficiaire:</p>
					<p className="font-normal text-black text-xl pt-2 text-center">
						{recu.beneficiaire.nom_complet}
					</p>
				</div>
			</div>
		</div>
	);
}

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const sp = await searchParams;
	const numero = typeof sp.numero === "string" ? sp.numero : "";
	const { prisma } = await import("../lib/prisma");

	const recu = numero
		? await prisma.recu.findFirst({
				where: { numero: { numero } },
				include: { beneficiaire: true, numero: true, user: true },
			})
		: null;

	const datePaiement = recu
		? new Date(recu.date).toLocaleDateString("fr-FR")
		: "";

	return (
		<main className="a4-portrait-dual-print relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fb923c_40%,#7c2d12_100%)] px-4 py-6 print:min-h-0 print:bg-white print:p-0 sm:px-6 lg:px-10">
			<section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col items-center justify-center gap-6 print:min-h-0 print:max-w-none print:justify-start print:py-0 print:gap-0">
				{!numero ? (
					<p className="text-center text-sm text-white/90 print:hidden">
						Ajoutez{" "}
						<code className="rounded bg-black/20 px-1.5 py-0.5">?numero=…</code>{" "}
						dans l’URL pour charger un reçu.
					</p>
				) : !recu ? (
					<p className="text-center text-sm text-white/90 print:hidden">
						Reçu introuvable pour ce numéro.
					</p>
				) : null}
				{recu ? (
					<>
						<PrintButton returnTo="/recus" />
						<div className="print:hidden w-full">
							<RecuSheet
								recu={recu}
								numero={numero}
								datePaiement={datePaiement}
							/>
						</div>
						<div className="print-dual-stack hidden print:flex print:w-full print:flex-col print:gap-0">
							<div className="print-dual-slot">
								<RecuSheet
									recu={recu}
									numero={numero}
									datePaiement={datePaiement}
								/>
							</div>
							<div className="print-dual-sep" />
							<div className="print-dual-slot">
								<RecuSheet
									recu={recu}
									numero={numero}
									datePaiement={datePaiement}
								/>
							</div>
						</div>
					</>
				) : null}
			</section>
		</main>
	);
}
