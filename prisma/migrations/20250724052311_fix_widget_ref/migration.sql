-- DropForeignKey
ALTER TABLE "AIConversation" DROP CONSTRAINT "AIConversation_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_roomId_fkey";

-- DropForeignKey
ALTER TABLE "StickyNote" DROP CONSTRAINT "StickyNote_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_roomId_fkey";

-- AlterTable
ALTER TABLE "AIConversation" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StickyNote" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "AIConversation" ADD CONSTRAINT "AIConversation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("anchorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("anchorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("anchorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickyNote" ADD CONSTRAINT "StickyNote_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("anchorId") ON DELETE RESTRICT ON UPDATE CASCADE;
