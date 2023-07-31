import { promises as fs } from "fs"
import path from "path"
import { getServerSession } from "next-auth/next"

import { PromptRequest } from "@/types/openai/request.type"
import { PromptResponse } from "@/types/openai/response.type"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { openai } from "@/lib/openai"
import { getPrompt } from "@/lib/prompt"

export const getSchedule = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
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
    throw new Error("No prompt request found")
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

  if (!message) throw new Error("No message from openai")

  const messageObject = JSON.parse(message) as PromptResponse
  return messageObject
}
