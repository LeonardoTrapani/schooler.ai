import {
  Class,
  Professor,
  ProfessorSection,
  Section,
  Subject,
} from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ProfessorSectionCreate } from "@/components/professor-sections/professor-section-create"

interface ProfessorsInSectionViewProps {
  sectionId: string
  section: Pick<Section, "id" | "name"> & {
    classes: Pick<Class, "id">[]
    professorSections: Pick<ProfessorSection, "id" | "totalClasses">[]
  }
  professors: (Pick<Professor, "id" | "name"> & {
    subjects: Pick<Subject, "id" | "name">[]
  })[]
  professorSections: (Pick<ProfessorSection, "id" | "totalClasses"> & {
    professor: Pick<Professor, "name" | "id">
  })[]
}

export function ProfessorsInSectionView({
  section,
  professors,
  professorSections,
}: ProfessorsInSectionViewProps) {
  return (
    <div className="flex flex-col">
      {professorSections.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No professors</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            No professors teach in this section yet.
          </EmptyPlaceholder.Description>
          <ProfessorSectionCreate
            buttonProps={{
              variant: "outline",
            }}
            from="section"
            professors={professors}
            section={section}
          />
        </EmptyPlaceholder>
      ) : (
        professorSections.map((professorSection) => (
          <p>{JSON.stringify(professorSection)}</p>
        ))
      )}
    </div>
  )
}
