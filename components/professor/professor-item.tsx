import Link from "next/link"
import { Professor, Subject } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfessorOperations } from "@/components/professor/professor-operations"

interface ProfessorItemProps {
  professor: Pick<Professor, "id" | "name" | "updatedAt"> & {
    subjects: Pick<Subject, "name">[]
  }
}

export function ProfessorItem({ professor }: ProfessorItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/professors/${professor.id}`}
          className="font-semibold hover:underline"
        >
          {professor.name}
        </Link>
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
          <p>
            {professor.subjects.map(
              (subject, i) =>
                subject.name + (i === professor.subjects.length - 1 ? "" : ", ")
            )}
          </p>
          <p className="hidden sm:inline-block">
            {professor.subjects.length > 0 && <span>&nbsp;&bull;&nbsp;</span>}
          </p>
          <p>{formatDate(professor.updatedAt?.toDateString())}</p>
        </div>
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
