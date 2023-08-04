import { z } from "zod"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postPreferenceSchema } from "@/lib/validations/preference"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postPreferenceSchema.parse(body)

    const preference = await db.preference.create({
      data: {
        preference: parsedBody.preference,
        importance: parsedBody.importance,
        professorId: parsedBody.professorId,
        sectionId: parsedBody.sectionId,
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(preference), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
