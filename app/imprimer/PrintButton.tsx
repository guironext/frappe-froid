"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

function PrinterIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
			<path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
			<rect x="6" y="14" width="12" height="8" rx="1" />
		</svg>
	);
}

type PrintButtonProps = {
	/** Navigates here after the print dialog closes (print or cancel). */
	returnTo?: string;
};

export function PrintButton({ returnTo }: PrintButtonProps) {
	const router = useRouter();

	const handlePrint = useCallback(() => {
		const goAfter = () => {
			if (returnTo) router.push(returnTo);
		};
		window.addEventListener("afterprint", goAfter, { once: true });
		window.print();
	}, [returnTo, router]);

	return (
		<button
			type="button"
			onClick={handlePrint}
			className="group print:hidden inline-flex min-h-11 items-center justify-center gap-2.5 rounded-2xl border border-white/50 bg-gradient-to-b from-white/95 to-amber-50/90 px-6 py-3 text-sm font-semibold tracking-wide text-amber-950 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/70 hover:from-white hover:to-amber-50 hover:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
		>
			<PrinterIcon className="text-amber-900/80 transition group-hover:text-amber-950" />
			<span className="tabular-nums">Imprimer</span>
		</button>
	);
}
