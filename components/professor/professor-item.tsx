import Link from "next/link"
import { Professor, Section, Subject } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfessorOperations } from "@/components/professor/professor-operations"

interface ProfessorItemProps {
  professor: Pick<Professor, "id" | "name"> & {
    subjects: Pick<Subject, "name">[]
  } & {
    professorSections: {
      section: Pick<Section, "name">
    }[]
  }
}

export function ProfessorItem({ professor }: ProfessorItemProps) {
  const hasSubtitle =
    professor.subjects.length > 0 || professor.professorSections.length > 0

  const uniqueSections = Array.from(
    new Set(professor.professorSections.map((section) => section.section.name))
  )
  const formattedSections = uniqueSections.map(
    (item, i) => item + (i === uniqueSections.length - 1 ? "" : ", ")
  )

  return (
    <div className="flex items-center justify-between p-4">
      <div
        className={cn("grid", {
          "grid-1": hasSubtitle,
        })}
      >
        <Link
          href={`/professors/${professor.id}`}
          className="font-semibold hover:underline"
        >
          {professor.name}
        </Link>
        {hasSubtitle && (
          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
            <p>
              {professor.subjects.map(
                (subject, i) =>
                  subject.name +
                  (i === professor.subjects.length - 1 ? "" : ", ")
              )}
            </p>
            <p className="hidden sm:inline-block">
              {professor.subjects.length > 0 &&
                professor.professorSections.length > 0 && (
                  <span>&nbsp;&bull;&nbsp;</span>
                )}
            </p>
            <p className="hidden sm:inline-block">{formattedSections}</p>
          </div>
        )}
      </div>
      <ProfessorOperations professor={{ id: professor.id }} />
    </div>
  )
}

ProfessorItem.Skeleton = function ProfessorItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
