/*
  Warnings:

  - A unique constraint covering the columns `[userId,friendId]` on the table `FriendShip` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FriendShip" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "FriendShip_userId_friendId_key" ON "FriendShip"("userId", "friendId");
