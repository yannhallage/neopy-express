-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'GERANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "MoyenDePaiement" AS ENUM ('ESPECES', 'ORANGE_MONEY', 'MTN_MONEY', 'MOOV_MONEY', 'WAVE', 'CARTE_BANCAIRE', 'AUTRE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "mot_de_passe_hash" TEXT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "maquis_id" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maquis" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "adresse" TEXT NOT NULL,
    "ville" TEXT,
    "telephone" TEXT,
    "image_url" TEXT,
    "ouvert" BOOLEAN NOT NULL DEFAULT true,
    "proprietaire_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maquis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plats" (
    "id" TEXT NOT NULL,
    "maquis_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(10,2) NOT NULL,
    "image_url" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "maquis_id" TEXT NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "moyen_paiement" "MoyenDePaiement" NOT NULL DEFAULT 'ESPECES',
    "montant_total" DECIMAL(10,2) NOT NULL,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lignes_commande" (
    "id" TEXT NOT NULL,
    "commande_id" TEXT NOT NULL,
    "plat_id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "lignes_commande_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telephone_key" ON "users"("telephone");

-- CreateIndex
CREATE INDEX "maquis_proprietaire_id_idx" ON "maquis"("proprietaire_id");

-- CreateIndex
CREATE INDEX "plats_maquis_id_idx" ON "plats"("maquis_id");

-- CreateIndex
CREATE INDEX "commandes_user_id_idx" ON "commandes"("user_id");

-- CreateIndex
CREATE INDEX "commandes_maquis_id_idx" ON "commandes"("maquis_id");

-- CreateIndex
CREATE INDEX "commandes_statut_idx" ON "commandes"("statut");

-- CreateIndex
CREATE INDEX "lignes_commande_commande_id_idx" ON "lignes_commande"("commande_id");

-- CreateIndex
CREATE INDEX "lignes_commande_plat_id_idx" ON "lignes_commande"("plat_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_maquis_id_fkey" FOREIGN KEY ("maquis_id") REFERENCES "maquis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maquis" ADD CONSTRAINT "maquis_proprietaire_id_fkey" FOREIGN KEY ("proprietaire_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plats" ADD CONSTRAINT "plats_maquis_id_fkey" FOREIGN KEY ("maquis_id") REFERENCES "maquis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_maquis_id_fkey" FOREIGN KEY ("maquis_id") REFERENCES "maquis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lignes_commande" ADD CONSTRAINT "lignes_commande_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "plats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
