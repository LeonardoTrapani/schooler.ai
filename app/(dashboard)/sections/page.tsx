import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { SectionCreate } from "@/components/section/section-create"
import { SectionItem } from "@/components/section/section-item"
import { DashboardShell } from "@/components/shell"

export default async function Sections() {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }
  const sections = await db.section.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader heading="Sections" text="Create and manage sections">
        <SectionCreate />
      </DashboardHeader>
      <div>
        {sections?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {sections.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="empty" />
            <EmptyPlaceholder.Title>No sections created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any section yet.
            </EmptyPlaceholder.Description>
            <SectionCreate buttonProps={{ variant: "outline" }} />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
