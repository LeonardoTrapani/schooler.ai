import { z } from "zod"

export const promptResponseSchema = z.object({
  score: z.number(),
  notes: z.array(z.string()),
  suggestions: z.array(z.string()),
  scheduledClasses: z.array(
    z.object({
      professorId: z.string(),
      classId: z.string(),
      sectionId: z.string(),
    })
  ),
})
