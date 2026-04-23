import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../lib/prisma"
import { CreateBeneficiaireForm } from "./CreateBeneficiaireForm"

export const dynamic = "force-dynamic"

/** First issued receipt number (five digits, leading zeros). */
const FIRST_RECU_NUMERO_INT = 1249

function formatRecuNumero(n: number) {
  return String(n).padStart(5, "0")
}

function formatFCFA(amount: number) {
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  })
    .format(amount)
    // Next/Node may use narrow no-break spaces; normalize to regular spaces.
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ")

  return `${formatted}FCFA`
}

async function createBeneficiaireAndRecu(formData: FormData) {
  "use server"

  const { auth, currentUser } = await import("@clerk/nextjs/server")
  const { prisma } = await import("../lib/prisma")
  const { Prisma } = await import("@prisma/client")

  const { userId } = await auth()
  if (!userId) {
    return { status: "error", message: "Connectez-vous pour creer un recu." } as const
  }

  const clerkUser = await currentUser()
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress

  if (!email) {
    return {
      status: "error",
      message: "Aucune adresse e-mail sur votre compte Clerk.",
    } as const
  }

  const dbUser = await prisma.user.findUnique({ where: { email } })
  if (!dbUser) {
    return {
      status: "error",
      message: "Completez d'abord l'onboarding (nom et prenom) sur /onboarding.",
    } as const
  }

  const nom_complet = String(formData.get("nom_complet") ?? "").trim()
  const telephone = String(formData.get("telephone") ?? "").trim()

  if (!nom_complet || !telephone) {
    return { status: "error", message: "Veuillez remplir le nom complet et le telephone." } as const
  }

  const MAX_ATTEMPTS = 8

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const rows = await prisma.numero.findMany({
        select: { numero: true },
      })

      let last = FIRST_RECU_NUMERO_INT - 1
      for (const { numero: n } of rows) {
        if (/^\d{5}$/.test(n)) {
          const v = Number.parseInt(n, 10)
          if (!Number.isNaN(v)) last = Math.max(last, v)
        }
      }

      const next = last + 1

      if (next > 99_999) {
        throw new Error("Numero de recu maximum (99999) atteint.")
      }

      const numero = formatRecuNumero(next)

      await prisma.recu.create({
        data: {
          user: { connect: { id: dbUser.id } },
          beneficiaire: {
            create: {
              nom_complet,
              telephone,
            },
          },
          numero: { create: { numero } },
        },
      })

      return { status: "success", numero } as const
    } catch (err) {
      const duplicate =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"

      if (duplicate && attempt < MAX_ATTEMPTS - 1) {
        continue
      }

      if (err instanceof Error && err.message.includes("99999")) {
        return { status: "error", message: err.message } as const
      }

      console.error("createBeneficiaireAndRecu", err)

      const detail =
        process.env.NODE_ENV === "development" && err instanceof Error
          ? ` — ${err.message}`
          : ""

      return {
        status: "error",
        message: `Impossible de creer le recu.${detail} Reessayez dans un instant.`,
      } as const
    }
  }

  return {
    status: "error",
    message: "Impossible de creer le recu. Reessayez dans un instant.",
  } as const
}

export default async function Page() {
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
                    Nouveau Réquérant
                  </span>
                  <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                    Creer un réquérant (et generer un recu automatiquement)
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base">
                    A chaque creation de réquérant, un recu est cree dans la base
                    de donnees et lie a ce réquérant.
                  </p>
                </div>

                <Link
                  href="/recus"
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white/80 px-5 py-3 text-sm font-medium text-orange-700 shadow-lg shadow-orange-950/5 ring-1 ring-orange-200 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Retour
                </Link>
              </header>
              <CreateBeneficiaireForm
                // Wrap to match useActionState signature (prevState, formData)
                action={async (_prevState, formData) => {
                  "use server"
                  return await createBeneficiaireAndRecu(formData)
                }}
                montantLabel={formatFCFA(100000)}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}