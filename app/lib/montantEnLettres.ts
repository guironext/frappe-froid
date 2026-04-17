const UNITS = [
	"zéro",
	"un",
	"deux",
	"trois",
	"quatre",
	"cinq",
	"six",
	"sept",
	"huit",
	"neuf",
	"dix",
	"onze",
	"douze",
	"treize",
	"quatorze",
	"quinze",
	"seize",
] as const;

const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"] as const;

/** Cardinal 0–99 (French), for use inside larger compounds (no "quatre-vingts" trailing s). */
function cardinalUnder100(n: number, pluralVingt: boolean): string {
	if (n < 17) return UNITS[n];
	if (n < 20) return `dix-${UNITS[n - 10]}`;

	if (n < 70) {
		const d = Math.floor(n / 10);
		const u = n % 10;
		const ten = TENS[d];
		if (u === 0) return ten;
		if (u === 1 && d !== 8) return `${ten} et un`;
		return `${ten}-${cardinalUnder100(u, false)}`;
	}

	if (n < 80) {
		if (n === 71) return "soixante et onze";
		return `soixante-${cardinalUnder100(n - 60, false)}`;
	}

	if (n === 80) return pluralVingt ? "quatre-vingts" : "quatre-vingt";
	return `quatre-vingt-${cardinalUnder100(n - 80, false)}`;
}

function cardinalUnder1000(n: number, pluralCent: boolean): string {
	if (n < 100) return cardinalUnder100(n, n === 80);

	const c = Math.floor(n / 100);
	const rest = n % 100;

	let prefix: string;
	if (c === 1) prefix = "cent";
	else if (rest === 0 && pluralCent) prefix = `${UNITS[c]} cents`;
	else prefix = `${UNITS[c]} cent`;

	if (rest === 0) return prefix;
	/* « quatre-vingts » prend un s en fin de tranche (ex. cent quatre-vingts). */
	return `${prefix} ${cardinalUnder100(rest, rest === 80)}`;
}

function cardinalUnder1_000_000(n: number): string {
	if (n < 1000) return cardinalUnder1000(n, true);

	const thousands = Math.floor(n / 1000);
	const rest = n % 1000;

	let head: string;
	if (thousands === 1) head = "mille";
	else head = `${cardinalUnder1000(thousands, true)} mille`;

	if (rest === 0) return head;
	return `${head} ${cardinalUnder1000(rest, true)}`;
}

function cardinalUnder1e12(n: number): string {
	if (n < 1_000_000) return cardinalUnder1_000_000(n);

	const millions = Math.floor(n / 1_000_000);
	const rest = n % 1_000_000;

	const label = millions > 1 ? "millions" : "million";
	const head =
		millions === 1
			? `un ${label}`
			: `${cardinalUnder1_000_000(millions)} ${label}`;

	if (rest === 0) return head;
	return `${head} ${cardinalUnder1_000_000(rest)}`;
}

/**
 * Amount in French words for receipts (integer F CFA, rounded).
 */
export function montantEnLettres(montant: number | null | undefined): string {
	if (montant == null || Number.isNaN(montant)) return "—";
	const n = Math.round(Math.abs(montant));
	if (n === 0) return "zéro franc CFA";
	const words = cardinalUnder1e12(n);
	const franc = n > 1 ? "francs CFA" : "franc CFA";
	return `${words} ${franc}`;
}
