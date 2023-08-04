import { notFound, redirect } from "next/navigation"
import { Section, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Separator } from "@/components/ui/separator"
import { PreferencesView } from "@/components/preference/preferences-view"
import { ScheduleView } from "@/components/schedule/schedule-view"
import { ProfessorsInSectionView } from "@/components/section/professors-in-section-view"

async function getPostForUser(postId: Section["id"], userId: User["id"]) {
  return await db.section.findUnique({
    where: {
      id: postId,
      userId,
    },
    include: {
      classes: {
        orderBy: {
          start: "asc",
        },
        select: {
          start: true,
          end: true,
          id: true,
          day: true,
          updatedAt: true,
          professor: {
            select: {
              name: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
        },
      },
      professorSections: {
        select: {
          professor: {
            select: {
              name: true,
              id: true,
            },
          },
          id: true,
          totalClasses: true,
        },
      },
      preferences: {
        select: {
          id: true,
          preference: true,
          professor: {
            select: {
              name: true,
              id: true,
            },
          },
          importance: true,
        },
      },
    },
  })
}

interface SectionPageProps {
  params: { sectionId: string }
}

export default async function SectionPage({ params }: SectionPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const section = await getPostForUser(params.sectionId, user.id)

  if (!section) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-4xl md:text-5xl">{section.name}</h1>
      <Separator />
      <h2 className="font-heading text-2xl md:text-3xl">Schedule</h2>
      <ScheduleView classes={section.classes} />
      <h2 className="font-heading text-2xl md:text-3xl">Professors</h2>
      <ProfessorsInSectionView professorSection={section.professorSections} />
      <h2 className="font-heading text-2xl md:text-3xl">Preferences</h2>
      <PreferencesView
        from="section"
        preferences={section.preferences}
        sectionId={section.id}
      />
    </div>
  )
}
