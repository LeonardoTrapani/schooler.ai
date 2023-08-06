import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { promptApplySchema } from "@/lib/validations/openai"

export const revalidate = 0

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const classes = promptApplySchema.parse(json)

    const updatedClasses = await db.$transaction(async (prisma) => {
      const updatePromises = classes.map((classItem) =>
        prisma.class.update({
          where: { id: classItem.classId },
          data: {
            professorId: classItem.professorId,
            subjectId: classItem.subjectId,
          },
        })
      )

      return Promise.all(updatePromises)
    })

    return new Response(JSON.stringify(updatedClasses))
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
