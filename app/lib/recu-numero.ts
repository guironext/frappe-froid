import type { PrismaClient } from "@prisma/client"

/** First receipt number in the new sequence (5 digits, leading zero). */
export const RECU_NUMERO_INITIAL = "01220"
export const RECU_NUMERO_MAX = 99999

const NUMERO_WIDTH = 5

function parseRecuNumero(value: string): number | null {
	const digits = value.replace(/\D/g, "")
	if (!digits) return null
	const n = Number.parseInt(digits, 10)
	return Number.isNaN(n) ? null : n
}

const RECU_NUMERO_INITIAL_VALUE = parseRecuNumero(RECU_NUMERO_INITIAL)!

function formatRecuNumero(n: number): string {
	if (n > RECU_NUMERO_MAX) {
		throw new Error(
			`Le numéro de reçu ne peut pas dépasser ${String(RECU_NUMERO_MAX).padStart(NUMERO_WIDTH, "0")} (99999).`,
		)
	}
	return String(n).padStart(NUMERO_WIDTH, "0")
}

/** Normalizes stored values for display (e.g. on the print sheet). */
export function formatRecuNumeroDisplay(stored: string): string {
	const n = parseRecuNumero(stored)
	if (n === null) return stored
	return formatRecuNumero(n)
}

/**
 * Returns the next receipt number: starts at 01220, then increments by 1
 * for each new reçu. Older numbers below 01220 are ignored when choosing the next value.
 */
export async function getNextRecuNumero(
	prisma: PrismaClient,
): Promise<string> {
	const rows = await prisma.numero.findMany({
		select: { numero: true },
	})

	let max = RECU_NUMERO_INITIAL_VALUE - 1

	for (const row of rows) {
		const n = parseRecuNumero(row.numero)
		if (n !== null && n > max) {
			max = n
		}
	}

	const next =
		max < RECU_NUMERO_INITIAL_VALUE ? RECU_NUMERO_INITIAL_VALUE : max + 1

	return formatRecuNumero(next)
}
