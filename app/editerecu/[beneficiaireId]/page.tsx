import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import { updateBeneficiaire } from "./actions"
import { EditBeneficiaireForm } from "./EditBeneficiaireForm"

export const dynamic = "force-dynamic"

export default async function Page({
	params,
}: {
	params: Promise<{ beneficiaireId: string }>
}) {
	const { userId } = await auth()
	if (!userId) {
		redirect("/sign-in")
	}

	const clerkUser = await currentUser()
	const email =
		clerkUser?.primaryEmailAddress?.emailAddress ??
		clerkUser?.emailAddresses[0]?.emailAddress

	if (!email) {
		redirect("/sign-in")
	}

	const dbUser = await prisma.user.findUnique({ where: { email } })
	if (!dbUser) {
		redirect("/onboarding")
	}

	const { beneficiaireId } = await params

	const beneficiaire = await prisma.beneficiaire.findUnique({
		where: { id: beneficiaireId },
	})

	if (!beneficiaire) {
		notFound()
	}

	const action = updateBeneficiaire.bind(null, beneficiaireId)

	return (
		<main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fb923c_40%,#7c2d12_100%)] px-4 py-6 sm:px-6 lg:px-10">
			<section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
				<div className="w-full overflow-hidden rounded-4xl border border-white/25 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
					<div className="relative overflow-hidden rounded-[1.75rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,247,237,0.78)_45%,rgba(255,237,213,0.72)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_30px_80px_rgba(120,53,15,0.18)] sm:p-10 lg:p-12">
						<div className="absolute inset-0 bg-[linear-gradient(rgba(120,53,15,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(120,53,15,0.12)_1px,transparent_1px)] bg-size-[34px_34px] opacity-20" />
						<div className="absolute inset-x-8 top-0 h-px bg-white/70" />

						<div className="relative flex flex-col gap-8">
							<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
								<div>
									<span className="inline-flex rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm">
										Modifier le réquérant
									</span>
									<h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
										Éditer le bénéficiaire
									</h1>
								</div>

								<div className="flex flex-wrap gap-2">
									<Link
										href="/point"
										prefetch={false}
										className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white/80 px-5 py-3 text-sm font-medium text-orange-700 shadow-lg shadow-orange-950/5 ring-1 ring-orange-200 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
									>
										Point FAF
									</Link>
									<Link
										href="/recus"
										prefetch={false}
										className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white/80 px-5 py-3 text-sm font-medium text-orange-700 shadow-lg shadow-orange-950/5 ring-1 ring-orange-200 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
									>
										Retour
									</Link>
								</div>
							</header>

							<EditBeneficiaireForm
								action={action}
								defaultNom={beneficiaire.nom_complet}
								defaultTelephone={beneficiaire.telephone}
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}
