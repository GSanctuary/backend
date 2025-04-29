-- DropForeignKey
ALTER TABLE "AIMessage" DROP CONSTRAINT "AIMessage_conversationId_fkey";

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AIConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
