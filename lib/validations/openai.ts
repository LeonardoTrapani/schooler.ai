import { z } from "zod"

export const promptResponseSchema = z.object({
  score: z.number(),
  notes: z.array(z.string()),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      classes: z.array(
        z.object({
          id: z.string(),
          professor: z.object({
            id: z.string(),
            name: z.string(),
          }),
          subject: z.object({
            name: z.string(),
            id: z.string(),
          }),
        })
      ),
    })
  ),
})

export const promptRequestSchema = z.object({
  sections: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      classes: z.array(
        z.object({
          id: z.string(),
          start: z.string(),
          end: z.string(),
          day: z.string(),
          professorId: z.string().nullable(),
          sectionId: z.string().nullable(),
        })
      ),
    })
  ),
  professors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      professorSections: z.array(
        z.object({
          totalClasses: z.number(),
          sectionId: z.string(),
          subject: z.object({
            name: z.string(),
            id: z.string(),
          }),
        })
      ),
    })
  ),
  preferences: z.array(
    z.object({
      professorId: z.string().nullable(),
      sectionId: z.string().nullable(),
      preference: z.string(),
      importance: z.enum(["HIGH", "MEDIUM", "LOW"]),
    })
  ),
})

export const promptApplySchema = z.array(
  z.object({
    professorId: z.string(),
    classId: z.string(),
  })
)
