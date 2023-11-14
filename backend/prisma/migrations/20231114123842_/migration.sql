-- CreateEnum
CREATE TYPE "Stts" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Stts" NOT NULL DEFAULT 'OFFLINE';
