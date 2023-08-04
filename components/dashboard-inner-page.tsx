import Link from "next/link"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface DashboardInnserPageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardInnerPage({ children }: DashboardInnserPageProps) {
  return <div>{children}</div>
}

interface DashboardInnerPageTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  closeHref?: string
}

DashboardInnerPage.Title = function DashboardInnerSectionTitle({
  className,
  closeHref,
  ...props
}: DashboardInnerPageTitleProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1
          className={cn("font-heading text-4xl md:text-5xl", className)}
          {...props}
        />
        {closeHref && (
          <Link href={closeHref}>
            <Icons.close />
          </Link>
        )}
      </div>
      <Separator className="my-4" />
    </>
  )
}

DashboardInnerPage.Body = function DashboardInnerPageBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-10", className)} {...props}>
      {children}
    </div>
  )
}

DashboardInnerPage.Section = function DashboardInnerPageSection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

interface DashboardInnerPageSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
}

DashboardInnerPage.SectionHeader = function DashboardInnerPageSectionHeader({
  title,
  subtitle,
  className,
  children,
  ...props
}: DashboardInnerPageSectionHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between mb-2", className)}
      {...props}
    >
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl md:text-3xl">{title}</h1>
        {subtitle && (
          <p className="text-md text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}

DashboardInnerPage.Skeleton = function DashboardInnerPageSkeleton({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <DashboardInnerPage>
      <div className="flex justify-between">
        <Skeleton className="h-10 md:h-12 max-w-[144px]" />
        <button>
          <Icons.close />
        </button>
      </div>
      <Separator className="my-4" />
      <DashboardInnerPage.Body>{children}</DashboardInnerPage.Body>
    </DashboardInnerPage>
  )
}

DashboardInnerPage.SectionSkeleton =
  function DashboardInnerPageSkeletonSection({
    children,
    subtitle,
    title,
    ...props
  }: DashboardInnerPageSectionHeaderProps) {
    return (
      <DashboardInnerPage.Section {...props}>
        <DashboardInnerPage.SectionHeader title={title} subtitle={subtitle}>
          {children}
        </DashboardInnerPage.SectionHeader>
        <Skeleton className="h-96" />
      </DashboardInnerPage.Section>
    )
  }
