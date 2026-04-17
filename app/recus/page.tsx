import Link from "next/link"

const actions = [
  {
    title: "Nouveau Recu",
    href: "/editerecu",
    description:
      "Cree rapidement un nouveau recu avec une mise en page claire et prete a etre imprimee.",
    eyebrow: "Action principale",
    accent: "from-orange-500 via-amber-400 to-yellow-300",
    buttonClass:
      "bg-zinc-950 text-white hover:bg-zinc-800 focus-visible:ring-zinc-950",
  },
  {
    title: "Point FAF",
    href: "/point",
    description:
      "Accede au suivi FAF pour retrouver les informations utiles et verifier les points en un coup d'oeil.",
    eyebrow: "Suivi",
    accent: "from-white via-amber-100 to-orange-100",
    buttonClass:
      "bg-white text-orange-700 ring-1 ring-orange-200 hover:bg-amber-50 focus-visible:ring-orange-500",
  },
]

export default function RecusPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fb923c_40%,#7c2d12_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="absolute inset-0">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-orange-950/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-4xl border border-white/25 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,247,237,0.78)_45%,rgba(255,237,213,0.72)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_30px_80px_rgba(120,53,15,0.18)] sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(120,53,15,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(120,53,15,0.12)_1px,transparent_1px)] bg-size-[34px_34px] opacity-20" />
            <div className="absolute inset-x-8 top-0 h-px bg-white/70" />

            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700 shadow-sm">
                  Gestion des recus
                </span>

                <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                  Un espace plus propre pour creer et suivre vos recus.
                </h1>

              
              </div>

            </div>

            <div className="relative mt-10 grid gap-5 lg:grid-cols-2">
              {actions.map((action) => (
                <article
                  key={action.title}
                  className="group rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-xl shadow-orange-950/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6"
                >
                  <div
                    className={`bg-linear-to-r h-2 w-28 rounded-full ${action.accent}`}
                  />

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                        {action.eyebrow}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                        {action.title}
                      </h2>
                    </div>

                   
                  </div>

                  <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
                    {action.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Pret a utiliser
                    </div>

                    <Link
                      href={action.href}
                      prefetch={false}
                      className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${action.buttonClass}`}
                    >
                      Ouvrir
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}