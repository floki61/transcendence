/*
  Warnings:

  - Added the required column `loserId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "loserId" TEXT NOT NULL,
ADD COLUMN     "winnerId" TEXT NOT NULL;
