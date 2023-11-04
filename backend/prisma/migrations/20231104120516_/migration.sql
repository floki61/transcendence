/*
  Warnings:

  - You are about to drop the column `loserId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `loserScore` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerScore` on the `Game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player1Id,player2Id]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `player1Id` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1Score` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Id` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2Score` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_loserId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_winnerId_fkey";

-- DropIndex
DROP INDEX "Game_winnerId_loserId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "loserId",
DROP COLUMN "loserScore",
DROP COLUMN "winnerId",
DROP COLUMN "winnerScore",
ADD COLUMN     "player1Id" TEXT NOT NULL,
ADD COLUMN     "player1Score" INTEGER NOT NULL,
ADD COLUMN     "player2Id" TEXT NOT NULL,
ADD COLUMN     "player2Score" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1Id_player2Id_key" ON "Game"("player1Id", "player2Id");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
