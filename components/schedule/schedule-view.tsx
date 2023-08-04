import { Class, Professor, Subject } from "@prisma/client"

import { EmptyPlaceholder } from "@/components/empty-placeholder"

interface ScheduleViewProps {
  classes: (Pick<Class, "id" | "end" | "start" | "day"> & {
    professor: Pick<Professor, "name"> | null
    subject: Pick<Subject, "name"> | null
  })[]
}

export function ScheduleView({ classes }: ScheduleViewProps) {
  return (
    <div className="flex flex-col">
      {classes.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No classes</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any classes for this section yet.
          </EmptyPlaceholder.Description>
          {
            //TODO :Schedule classes button
          }
        </EmptyPlaceholder>
      ) : (
        classes.map((classItem) => <p>{JSON.stringify(classItem)}</p>)
      )}
    </div>
  )
}
