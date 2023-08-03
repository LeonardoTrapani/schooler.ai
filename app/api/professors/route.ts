import { z } from "zod"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postProfessorSchema } from "@/lib/validations/professor"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postProfessorSchema.parse(body)

    const existingProfessor = await db.professor.findFirst({
      where: {
        name: parsedBody.name,
      },
    })

    if (existingProfessor) {
      return new Response(
        `Professor ${existingProfessor.name} already exists`,
        { status: 409 }
      )
    }

    const professor = await db.professor.create({
      data: {
        name: parsedBody.name,
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(professor), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
