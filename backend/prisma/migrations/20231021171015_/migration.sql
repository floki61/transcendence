-- CreateTable
CREATE TABLE "Achivement" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "achivementName" TEXT NOT NULL,
    "alreadyAchieved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achivement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "notificationName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Achivement_uid_achivementName_key" ON "Achivement"("uid", "achivementName");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_uid_notificationName_key" ON "Notification"("uid", "notificationName");

-- AddForeignKey
ALTER TABLE "Achivement" ADD CONSTRAINT "Achivement_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
