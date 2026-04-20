import { OnboardingForm } from "./OnboardingForm"

export default function OnboardingPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f59e0b_45%,#7c2d12_100%)] px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
			<div className="absolute inset-0">
				<div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
				<div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-orange-950/30 blur-3xl" />
			</div>

			<section className="relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
				<div className="w-full overflow-hidden rounded-4xl border border-white/25 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-12">
					<div className="relative overflow-hidden rounded-4xl bg-transparent px-4 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_30px_80px_rgba(120,53,15,0.18)] sm:px-10 sm:py-14">
						<div className="absolute inset-0">
							<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08)_38%,rgba(120,53,15,0.06)_100%)]" />
							<div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-transparent blur-3xl" />
							<div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-yellow-600/40 blur-3xl" />
							<div className="absolute bottom-0 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-orange-300/25 blur-3xl" />
							<div className="absolute inset-0 bg-[linear-gradient(rgba(120,53,15,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(120,53,15,0.45)_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.08]" />
							<div className="absolute inset-x-6 top-0 h-px bg-white/70 sm:inset-x-10" />
						</div>
						<div className="relative z-10 flex flex-col items-center gap-8 text-center">

                            <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
                                Bienvenue sur Frappe a Froid
                            </h1>
                            <p className="text-balance text-sm text-zinc-600 sm:text-base">
                                Connectez-vous pour accéder à votre tableau de bord et à votre parcours d&apos;intégration.
                            </p>
                            <div className="flex w-full flex-col items-center gap-4">
                                <OnboardingForm />
                            </div>
                        </div>
					</div>
				</div>
			</section>
		</main>
	)
}
