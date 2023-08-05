import { z } from "zod"

import { verifyCurrentUserHasAccessToSections } from "@/lib/current-user-has-access"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postScheduleSchema } from "@/lib/validations/schedule"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postScheduleSchema.parse(body)

    const userHasAccessToSections = verifyCurrentUserHasAccessToSections(
      user.id,
      parsedBody.map((item) => item.sectionId)
    )

    if (!userHasAccessToSections) {
      return new Response(null, { status: 403 })
    }

    await db.class.deleteMany({
      where: {
        sectionId: {
          in: parsedBody.map((item) => item.sectionId),
        },
        AND: {
          section: {
            userId: user.id,
          },
        },
      },
    })

    const classes = await db.class.createMany({
      data: parsedBody,
    })

    return new Response(JSON.stringify(classes), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
