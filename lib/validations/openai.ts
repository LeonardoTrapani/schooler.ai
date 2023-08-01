import { z } from "zod"

export const promptResponseSchema = z.object({
  score: z.number(),
  notes: z.array(z.string()),
  sections: z.array(
    z.object({
      sectionId: z.string(),
      classes: z.array(
        z.object({
          professorId: z.string(),
          classId: z.string(),
        })
      ),
    })
  ),
})

export const promptApplySchema = z.array(
  z.object({
    professorId: z.string(),
    classId: z.string(),
  })
)
