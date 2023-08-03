import { z } from "zod"

export const patchSectionSchema = z.object({
  name: z.string().trim().min(3).optional(),
})

export const postSectionSchema = z.object({
  name: z.string().trim().min(3),
})
