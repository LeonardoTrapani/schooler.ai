/*
  Warnings:

  - A unique constraint covering the columns `[sectionId,professorId,subjectId]` on the table `ProfessorSection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subjectId` to the `ProfessorSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProfessorSection" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProfessorSection_sectionId_professorId_subjectId_key" ON "ProfessorSection"("sectionId", "professorId", "subjectId");

-- AddForeignKey
ALTER TABLE "ProfessorSection" ADD CONSTRAINT "ProfessorSection_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
