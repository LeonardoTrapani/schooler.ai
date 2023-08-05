import { db } from "@/lib/db"

export async function verifyCurrentUserHasAccessToProfessor(
  userId: string,
  professorId: string
) {
  const count = await db.professor.count({
    where: {
      id: professorId,
      userId,
    },
  })

  return count > 0
}

export async function verifyCurrentUserHasAccessToSection(
  userId: string,
  sectionId: string
) {
  const count = await db.section.count({
    where: {
      id: sectionId,
      userId,
    },
  })

  return count > 0
}
