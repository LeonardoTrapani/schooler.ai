import { z } from "zod"

export const patchProfessorSchema = z.object({
  name: z.string().optional(),
})

export const postProfessorSchema = z.object({
  name: z.string(),
})
