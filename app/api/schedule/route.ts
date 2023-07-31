import { promises as fs } from "fs"
import path from "path"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { PromptRequest } from "@/types/openai/request.type"
import { PromptResponse } from "@/types/openai/response.type"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { openai } from "@/lib/openai"
import { getPrompt } from "@/lib/prompt"
import { promptResponseSchema } from "@/lib/validations/openai"

export const revalidate = 0

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const openaidirectory = path.join(process.cwd(), "/types/openai")
    const requestType = await fs.readFile(
      openaidirectory + "/request.type.ts",
      "utf8"
    )
    const responseType = await fs.readFile(
      openaidirectory + "/response.type.ts",
      "utf8"
    )
    const promptRequest = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        professors: {
          select: {
            id: true,
            professorSections: {
              select: {
                totalClasses: true,
                sectionId: true,
              },
            },
          },
        },
        sections: {
          select: {
            id: true,
            classes: {
              select: {
                id: true,
                start: true,
                end: true,
                day: true,
                sectionId: true,
                professorId: true,
              },
            },
          },
        },
        preferences: {
          select: {
            professorId: true,
            sectionId: true,
            preference: true,
            importance: true,
          },
        },
      },
    })

    if (!promptRequest) {
      return new Response("Could not access the information", { status: 400 })
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content: getPrompt(requestType, responseType),
        },
        {
          role: "user",
          content: JSON.stringify(promptRequest as PromptRequest),
        },
      ],
      temperature: 0,
    })

    const message = response.data.choices[0].message?.content

    if (!message)
      return new Response("No response from openai", { status: 400 })

    const messageObject = JSON.parse(message)
    const parsedMessage = promptResponseSchema.parse(messageObject)
    console.log("The parsed message is", parsedMessage)

    return new Response(JSON.stringify(parsedMessage), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    console.error("The error is", error)
    return new Response("There was an error", { status: 400 })
  }
}
