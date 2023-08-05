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

export async function verifyCurrentUserHasAccessToProfessorWithSubject(
  userId: string,
  professorId: string,
  subjectId: string
) {
  const count = await db.professor.count({
    where: {
      id: professorId,
      userId,
      subjects: {
        some: {
          id: subjectId,
        },
      },
    },
  })

  console.log({ count, professorId, subjectId })
  return count > 0
}

export async function verifyCurrentUserHasAccessToSections(
  userId: string,
  sectionIds: string[]
) {
  const count = await db.section.count({
    where: {
      id: {
        in: sectionIds,
      },
      AND: {
        userId: userId,
      },
    },
  })

  return count > 0
}
