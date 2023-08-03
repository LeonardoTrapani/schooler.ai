import { z } from "zod"

export const patchProfessorSchema = z.object({
  name: z.string().trim().min(3).optional(),
})

export const postProfessorSchema = z.object({
  name: z.string().trim().min(3),
})
