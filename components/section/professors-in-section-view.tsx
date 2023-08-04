import { Professor, ProfessorSection } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ProfessorCreate } from "@/components/professor/professor-create"

interface ProfessorsInSectionViewProps {
  professorSection: (Pick<ProfessorSection, "id" | "totalClasses"> & {
    professor: Pick<Professor, "name" | "id">
  })[]
}

export function ProfessorsInSectionView({
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
          <ProfessorCreate
            buttonProps={{
              variant: "outline",
            }}
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
