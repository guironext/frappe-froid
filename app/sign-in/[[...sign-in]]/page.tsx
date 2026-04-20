import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f59e0b_45%,#7c2d12_100%)] px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
			<div className="absolute inset-0">
				<div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
				<div className="absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-orange-950/30 blur-3xl" />
			</div>

				<div className="flex flex-col items-center gap-8 text-center">
					<div className="flex flex-col items-center gap-6">
						<div className="relative flex w-full flex-col items-center justify-center gap-4 sm:h-48 sm:block">
							<div className="logo logo-right">
								<div className="rounded-3xl border border-white/80 bg-white/90 p-2.5 shadow-xl shadow-orange-950/10 backdrop-blur sm:rounded-[1.75rem] sm:p-3">
									<Image
										src="/logo3.jpeg"
										alt="Logo Frappe a Froid"
										width={180}
										height={180}
										priority
										className="h-28 w-28 rounded-2xl object-cover sm:h-44 sm:w-44 sm:rounded-[1.1rem]"
									/>
								</div>
							</div>

							<div className="logo logo-left">
								<div className="rounded-3xl border border-white/80 bg-white/90 p-2.5 shadow-xl shadow-orange-950/10 backdrop-blur sm:rounded-[1.75rem] sm:p-3">
									<Image
										src="/logo.jpeg"
										alt="Deuxieme logo Frappe a Froid"
										width={180}
										height={180}
										priority
										className="h-28 w-28 rounded-2xl object-cover sm:h-44 sm:w-44 sm:rounded-[1.1rem]"
									/>
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
								Frappe a Froid
							</h1>

							
						</div>
					</div>
					<SignIn
						routing="path"
						path="/sign-in"
						fallbackRedirectUrl="/recus"
						signUpUrl="/sign-up"
						appearance={{
							elements: { rootBox: "mx-auto" },
						}}
					/>
				</div>
			
		</main>
	);
}
