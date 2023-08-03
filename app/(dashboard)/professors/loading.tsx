import { DashboardHeader } from "@/components/header"
import { ProfessorCreate } from "@/components/professor/professor-create"
import { ProfessorItem } from "@/components/professor/professor-item"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Professors" text="Create and manage professors">
        <ProfessorCreate />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <ProfessorItem.Skeleton />
        <ProfessorItem.Skeleton />
        <ProfessorItem.Skeleton />
        <ProfessorItem.Skeleton />
        <ProfessorItem.Skeleton />
        <ProfessorItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
