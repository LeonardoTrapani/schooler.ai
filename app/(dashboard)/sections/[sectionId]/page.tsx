import { notFound, redirect } from "next/navigation"
import { Section, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardInnerPage } from "@/components/dashboard-inner-page"
import { PreferenceCreate } from "@/components/preference/preference-create"
import { PreferencesView } from "@/components/preference/preferences-view"
import { ProfessorSectionCreate } from "@/components/professor-sections/professor-section-create"
import { ScheduleCreate } from "@/components/schedule/schedule-create"
import { ScheduleView } from "@/components/schedule/schedule-view"
import { ProfessorsInSectionView } from "@/components/section/professors-in-section-view"

async function getSectionForUser(postId: Section["id"], userId: User["id"]) {
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

async function getProfessorsForUser(userId: User["id"]) {
  return await db.professor.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      subjects: {
        select: {
          name: true,
          id: true,
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

  const professorsPromise = getProfessorsForUser(user.id)
  const sectionPromise = getSectionForUser(params.sectionId, user.id)

  const [professors, section] = await Promise.all([
    professorsPromise,
    sectionPromise,
  ])

  if (!section) {
    notFound()
  }

  return (
    <DashboardInnerPage>
      <DashboardInnerPage.Title closeHref="/sections">
        {section.name}
      </DashboardInnerPage.Title>
      <DashboardInnerPage.Body>
        <DashboardInnerPage.Section>
          <DashboardInnerPage.SectionHeader
            title="Schedule"
            subtitle="All the classes, professors and subjects scheduled for this section"
          >
            <ScheduleCreate section={{ id: section.id, name: section.name }} />
          </DashboardInnerPage.SectionHeader>
          <ScheduleView
            classes={section.classes}
            section={{ id: section.id, name: section.name }}
          />
        </DashboardInnerPage.Section>
        <DashboardInnerPage.Section>
          <DashboardInnerPage.SectionHeader
            title="Professors"
            subtitle="All the professors assigned for this section, with the amout of classes they have for each subject"
          >
            <ProfessorSectionCreate
              from="section"
              sectionId={section.id}
              professors={professors}
            />
          </DashboardInnerPage.SectionHeader>
          <ProfessorsInSectionView
            professors={professors}
            professorSection={section.professorSections}
            sectionId={section.id}
          />
        </DashboardInnerPage.Section>
        <DashboardInnerPage.Section>
          <DashboardInnerPage.SectionHeader
            title="Preferences"
            subtitle="All the preferences of this section. Use them to create a schedule that fits your needs with our AI"
          >
            <PreferenceCreate from="section" sectionId={section.id} />
          </DashboardInnerPage.SectionHeader>
          <PreferencesView
            from="section"
            preferences={section.preferences}
            sectionId={section.id}
          />
        </DashboardInnerPage.Section>
      </DashboardInnerPage.Body>
    </DashboardInnerPage>
  )
}
