import { DashboardHeader } from "@/components/header"
import { SectionCreate } from "@/components/section/section-create"
import { SectionItem } from "@/components/section/section-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Sections" text="Create and manage sections">
        <SectionCreate />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <SectionItem.Skeleton />
        <SectionItem.Skeleton />
        <SectionItem.Skeleton />
        <SectionItem.Skeleton />
        <SectionItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
