import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

            <section className="relative mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
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

              <div className="title-wrap mt-6 flex max-w-xl flex-col items-center sm:mt-8">
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
                  Frappe a Froid
                </h1>

                <Link
                  href="/recus"
                  prefetch={false}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/15 transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 sm:mt-6 sm:px-6 sm:py-3.5 sm:text-base"
                >
                  Commencer
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
