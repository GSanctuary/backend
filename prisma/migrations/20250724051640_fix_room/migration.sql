/*
  Warnings:

  - You are about to drop the column `positions` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `scaleY` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[anchorId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anchorId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionX` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionY` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionZ` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rotation` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scaleZ` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "positions",
DROP COLUMN "scaleY",
ADD COLUMN     "anchorId" TEXT NOT NULL,
ADD COLUMN     "positionX" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "positionY" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "positionZ" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rotation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scaleZ" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_anchorId_key" ON "Room"("anchorId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");
