import { z } from "zod"

export const patchPreferenceSchema = z.object({
  preference: z.string().trim().min(3).optional(),
  importance: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  professorId: z.string().optional(),
  sectionId: z.string().optional(),
})

export const postPreferenceSchema = z.object({
  preference: z.string().trim().min(3),
  importance: z.enum(["HIGH", "MEDIUM", "LOW"]),
  professorId: z.string().optional(),
  sectionId: z.string().optional(),
})
