-- CreateTable
CREATE TABLE "Beneficiaire" (
    "id" TEXT NOT NULL,
    "nom_complet" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,

    CONSTRAINT "Beneficiaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recu" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "beneficiaireId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL DEFAULT 100000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recu_numero_key" ON "Recu"("numero");

-- AddForeignKey
ALTER TABLE "Recu" ADD CONSTRAINT "Recu_beneficiaireId_fkey" FOREIGN KEY ("beneficiaireId") REFERENCES "Beneficiaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
