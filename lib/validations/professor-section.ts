import * as z from "zod"

export const postProfessorSectionsSchema = z.object({
  professorId: z.string(),
  sectionId: z.string(),
  subjectId: z.string(),
  totalClasses: z
    .number()
    .or(z.string().regex(/\d+/).transform(Number))
    .refine((n) => n >= 1, "Must be at least 1"),
})
