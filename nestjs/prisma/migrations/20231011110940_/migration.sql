-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "fid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_uid_fid_key" ON "Block"("uid", "fid");

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_fid_fkey" FOREIGN KEY ("fid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
