import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { patchSectionSchema } from "@/lib/validations/section"

const routeContextSchema = z.object({
  params: z.object({
    sectionId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this section.
    if (!(await verifyCurrentUserHasAccessToSection(params.sectionId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the section.
    await db.section.delete({
      where: {
        id: params.sectionId,
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

    // Check if the user has access to this section.
    if (!(await verifyCurrentUserHasAccessToSection(params.sectionId))) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = patchSectionSchema.parse(json)

    await db.section.update({
      where: {
        id: params.sectionId,
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

async function verifyCurrentUserHasAccessToSection(sectionId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.section.count({
    where: {
      id: sectionId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
