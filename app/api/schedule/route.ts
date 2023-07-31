import { promises as fs } from "fs"
import path from "path"
import { getServerSession } from "next-auth/next"
import { Configuration, OpenAIApi } from "openai"

import { authOptions } from "@/lib/auth"
import { getPrompt } from "@/lib/prompt"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const revalidate = 0

export async function GET() {
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

    const response = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: [
        {
          role: "system",
          content: getPrompt(requestType, responseType),
        },
        {
          role: "user",
          content: JSON.stringify(""),
        },
      ],
      temperature: 0,
    })

    const message = response.data.choices[0].message?.content

    if (!message)
      return new Response("No response from openai", { status: 400 })

    const messageObject = JSON.parse(message)
    return new Response(JSON.stringify(messageObject), { status: 200 })
  } catch (error) {
    console.error("The error is", error)
    return new Response("There was an error", { status: 400 })
  }
}
