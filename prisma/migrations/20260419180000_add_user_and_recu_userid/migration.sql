-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Owner for existing receipts created before per-user tracking
INSERT INTO "User" ("id", "email", "nom", "prenom", "createdAt", "updatedAt")
VALUES (
    'clmigrationlegacy000001',
    'migration-legacy@frappe-froid.internal',
    'Hérité',
    'Système',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- AlterTable
ALTER TABLE "Recu" ADD COLUMN "userId" TEXT;

UPDATE "Recu" SET "userId" = 'clmigrationlegacy000001' WHERE "userId" IS NULL;

ALTER TABLE "Recu" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Recu" ADD CONSTRAINT "Recu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
