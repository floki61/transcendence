-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "rid" INTEGER NOT NULL,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_uid_rid_key" ON "Participant"("uid", "rid");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_rid_fkey" FOREIGN KEY ("rid") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
