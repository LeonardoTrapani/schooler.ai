import { z } from "zod"

export const postScheduleSchema = z.object({
  sectionId: z.string(),
  classes: z.array(
    z.object({
      id: z.string().optional(),
      start: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"), // HH:MM
      end: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"), // HH:MM
      day: z.number().int().min(1),
      subjectId: z.string().optional(),
      professorId: z.string().optional(),
      sectionId: z.string(),
    })
  ),
})
