import { z } from "zod"

import {
  verifyCurrentUserHasAccessToProfessor,
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

    const hasAccessToProfessor = await verifyCurrentUserHasAccessToProfessor(
      user.id,
      parsedBody.professorId
    )
    const hasAccessToSection = await verifyCurrentUserHasAccessToSection(
      user.id,
      parsedBody.sectionId
    )
    if (!hasAccessToProfessor || !hasAccessToSection) {
      return new Response(null, { status: 403 })
    }

    const existingProfessorSection = await db.professorSection.findFirst({
      where: {
        professorId: parsedBody.professorId,
        sectionId: parsedBody.sectionId,
      },
    })

    if (existingProfessorSection) {
      return new Response(`This professor is already teaching this section.`, {
        status: 409,
      })
    }

    const professorSection = await db.professorSection.create({
      data: {
        professorId: parsedBody.professorId,
        sectionId: parsedBody.sectionId,
        totalClasses: parsedBody.totalClasses,
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
