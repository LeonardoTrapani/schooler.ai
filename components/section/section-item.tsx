import Link from "next/link"
import { Section } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { SectionOperations } from "@/components/section/section-operations"

interface SectionItemProps {
  section: Pick<Section, "id" | "name" | "updatedAt">
}

export function SectionItem({ section }: SectionItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/sections/${section.id}`}
          className="font-semibold hover:underline"
        >
          {section.name}
        </Link>
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row">
          <p>{formatDate(section.updatedAt?.toDateString())}</p>
        </div>
      </div>
      <SectionOperations section={{ id: section.id }} />
    </div>
  )
}

SectionItem.Skeleton = function SectionItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
