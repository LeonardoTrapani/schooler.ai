import { z } from "zod"

import {
  verifyCurrentUserHasAccessToProfessorWithSubject,
  verifyCurrentUserHasAccessToSection,
} from "@/lib/current-user-has-access"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postProfessorSectionsSchema } from "@/lib/validations/professor-section"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postProfessorSectionsSchema.parse(body)

    const hasAccessToProfessorWithSubject =
      await verifyCurrentUserHasAccessToProfessorWithSubject(
        user.id,
        parsedBody.professorId,
        parsedBody.subjectId
      )

    const hasAccessToSection = await verifyCurrentUserHasAccessToSection(
      user.id,
      parsedBody.sectionId
    )
    if (!hasAccessToProfessorWithSubject || !hasAccessToSection) {
      return new Response(null, { status: 403 })
    }

    const totalClasses = await db.class.count({
      where: {
        sectionId: parsedBody.sectionId,
      },
    })
    const professorSections = await db.professorSection.findMany({
      where: {
        sectionId: parsedBody.sectionId,
      },
    })
    const totalClassesAssigned = professorSections.reduce(
      (acc, professorSection) => acc + professorSection.totalClasses,
      0
    )

    const totalClassesLeft = totalClasses - totalClassesAssigned
    const hasEnoughClasses = totalClassesLeft - parsedBody.totalClasses >= 0

    if (!hasEnoughClasses) {
      return new Response(
        JSON.stringify(
          `The section doesn't have enough classes to cover the total classes of the professor (${totalClassesLeft} classes left to assign).`
        ),
        { status: 422 }
      )
    }

    const existingProfessorSection = await db.professorSection.findFirst({
      where: {
        professorId: parsedBody.professorId,
        sectionId: parsedBody.sectionId,
        subjectId: parsedBody.subjectId,
      },
    })

    if (existingProfessorSection) {
      return new Response(
        JSON.stringify(
          `The professor with this subject was already added to this section. Consider editing the professor instead, or adding him again with some other subject.`
        ),
        {
          status: 409,
        }
      )
    }

    const professorSection = await db.professorSection.create({
      data: {
        professorId: parsedBody.professorId,
        sectionId: parsedBody.sectionId,
        totalClasses: parsedBody.totalClasses,
        subjectId: parsedBody.subjectId,
      },
    })

    return new Response(JSON.stringify(professorSection), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
