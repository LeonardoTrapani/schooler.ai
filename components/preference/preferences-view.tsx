import { Preference, Professor, Section } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"

import { PreferenceCreate } from "./preference-create"

type PreferencesViewProps =
  | {
      preferences: (Pick<Preference, "id" | "preference" | "importance"> & {
        professor: Pick<Professor, "name" | "id"> | null
        section: Pick<Section, "name" | "id"> | null
      })[]
      professorId?: string
      sectionId?: string
      from: undefined
    }
  | {
      preferences: (Pick<Preference, "id" | "preference" | "importance"> & {
        professor: Pick<Professor, "name" | "id"> | null
      })[]
      professorId?: string
      sectionId: string
      from: "section"
    }
  | {
      preferences: (Pick<Preference, "id" | "preference" | "importance"> & {
        section: Pick<Section, "name" | "id"> | null
      })[]
      professorId: string
      sectionId?: string

      from: "professor"
    }

export function PreferencesView({
  from,
  preferences,
  sectionId,
  professorId,
}: PreferencesViewProps) {
  return (
    <div className="flex flex-col">
      {preferences.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No preferences</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {!!from
              ? `This ${from} has no preferences yet.`
              : `No preferences yet.`}
          </EmptyPlaceholder.Description>
          <PreferenceCreate
            from={from}
            buttonProps={{ variant: "outline" }}
            professorId={professorId}
            sectionId={sectionId}
          />
        </EmptyPlaceholder>
      ) : (
        preferences.map((preference) => <p>{JSON.stringify(preference)}</p>)
      )}
    </div>
  )
}
