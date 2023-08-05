import * as z from "zod"

import { verifyCurrentUserHasAccessToProfessor } from "@/lib/current-user-has-access"
import { db } from "@/lib/db"
import { patchProfessorSchema } from "@/lib/validations/professor"

const routeContextSchema = z.object({
  params: z.object({
    professorId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this professor.
    if (!(await verifyCurrentUserHasAccessToProfessor(params.professorId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the professor.
    await db.professor.delete({
      where: {
        id: params.professorId,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this professor.
    if (!(await verifyCurrentUserHasAccessToProfessor(params.professorId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = patchProfessorSchema.parse(json)

    await db.professor.update({
      where: {
        id: params.professorId,
      },
      data: {
        name: body.name,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
