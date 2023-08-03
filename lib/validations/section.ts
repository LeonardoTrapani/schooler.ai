import { z } from "zod"

export const patchSectionSchema = z.object({
  name: z.string().optional(),
})

export const postSectionSchema = z.object({
  name: z.string(),
})
