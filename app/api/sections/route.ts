import { z } from "zod"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postSectionSchema } from "@/lib/validations/section"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postSectionSchema.parse(body)

    const existingSection = await db.section.findFirst({
      where: {
        name: parsedBody.name,
      },
    })

    if (existingSection) {
      return new Response(`Section ${existingSection.name} already exists`, {
        status: 409,
      })
    }

    const section = await db.section.create({
      data: {
        name: parsedBody.name,
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(section), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
