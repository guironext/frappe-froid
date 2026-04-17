-- CreateTable
CREATE TABLE "Numero" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Numero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Numero_numero_key" ON "Numero"("numero");

-- One Numero row per existing Reçu (numero was unique on Recu)
INSERT INTO "Numero" ("id", "numero", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, r."numero", r."createdAt", r."updatedAt"
FROM "Recu" r;

-- Link Recu -> Numero before dropping old column
ALTER TABLE "Recu" ADD COLUMN "numeroId" TEXT;

UPDATE "Recu" r
SET "numeroId" = n."id"
FROM "Numero" n
WHERE n."numero" = r."numero";

ALTER TABLE "Recu" ALTER COLUMN "numeroId" SET NOT NULL;

DROP INDEX "Recu_numero_key";

ALTER TABLE "Recu" DROP COLUMN "numero";

CREATE UNIQUE INDEX "Recu_numeroId_key" ON "Recu"("numeroId");

ALTER TABLE "Recu" ADD CONSTRAINT "Recu_numeroId_fkey" FOREIGN KEY ("numeroId") REFERENCES "Numero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
