/*
  Warnings:

  - Added the required column `roomId` to the `AIConversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `StickyNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIConversation" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "steps" TEXT[];

-- AlterTable
ALTER TABLE "StickyNote" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "positions" DOUBLE PRECISION[],
    "userId" INTEGER NOT NULL,
    "scaleX" DOUBLE PRECISION NOT NULL,
    "scaleY" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIConversation" ADD CONSTRAINT "AIConversation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickyNote" ADD CONSTRAINT "StickyNote_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
