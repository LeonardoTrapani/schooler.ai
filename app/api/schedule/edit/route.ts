import { z } from "zod"

import { verifyCurrentUserHasAccessToSections } from "@/lib/current-user-has-access"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postScheduleSchema } from "@/lib/validations/schedule"

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postScheduleSchema.parse(body)

    const userHasAccessToSections = verifyCurrentUserHasAccessToSections(
      user.id,
      parsedBody.classes.map((item) => item.sectionId)
    )

    if (!userHasAccessToSections) {
      return new Response(null, { status: 403 })
    }

    const transaction = await db.$transaction([
      db.class.deleteMany({
        where: {
          sectionId: parsedBody.sectionId,
        },
      }),
      db.class.createMany({
        data: parsedBody.classes,
      }),
    ])

    return new Response(JSON.stringify(transaction[1]), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
