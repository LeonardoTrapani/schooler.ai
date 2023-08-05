import { Professor, ProfessorSection } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"

import { SectionAddProfessor } from "./section-add-professor"

interface ProfessorsInSectionViewProps {
  sectionId: string
  professors: Pick<Professor, "id" | "name">[]
  professorSection: (Pick<ProfessorSection, "id" | "totalClasses"> & {
    professor: Pick<Professor, "name" | "id">
  })[]
}

export function ProfessorsInSectionView({
  sectionId,
  professors,
  professorSection: professorSections,
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
          <SectionAddProfessor
            buttonProps={{
              variant: "outline",
            }}
            from="section"
            professors={professors}
            sectionId={sectionId}
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
