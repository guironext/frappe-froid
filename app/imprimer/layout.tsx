export default function ImprimerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<style>{`
				@media print {
					@page {
						size: A4 portrait;
						margin: 5mm;
					}
					html {
						background: #fff !important;
					}
				}
			`}</style>
			{children}
		</>
	);
}
