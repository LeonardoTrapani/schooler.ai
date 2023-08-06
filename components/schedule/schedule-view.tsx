import { Class, Professor, Section, Subject } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ScheduleCreate } from "@/components/schedule/schedule-create"

interface ScheduleViewProps {
  classes: (Pick<Class, "id" | "end" | "start" | "day"> & {
    professor: Pick<Professor, "name"> | null
    subject: Pick<Subject, "name"> | null
  })[]
  section: Pick<Section, "id" | "name">
}

export function ScheduleView({ classes, section }: ScheduleViewProps) {
  return (
    <div className="flex flex-col">
      {classes.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No schedule</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any classes for this section yet.
          </EmptyPlaceholder.Description>
          <ScheduleCreate
            buttonProps={{
              variant: "outline",
            }}
            currentClasses={[]}
            section={section}
          />
        </EmptyPlaceholder>
      ) : (
        classes.map((classItem) => <p>{JSON.stringify(classItem)}</p>)
      )}
    </div>
  )
}
