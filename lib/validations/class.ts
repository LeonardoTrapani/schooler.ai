import { z } from "zod"

export const classSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"), // HH:MM
  end: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM"), // HH:MM
  day: z.number().int().min(1),
  sectionId: z.string(),
})
