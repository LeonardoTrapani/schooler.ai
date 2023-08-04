import { notFound, redirect } from "next/navigation"
import { Section, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

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
          professor: true,
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
    <div>
      <h1 className="font-heading text-3xl md:text-4xl">{section.name}</h1>
    </div>
  )
}
