import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface DashboardInnserPageProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardInnerPage({ children }: DashboardInnserPageProps) {
  return <div>{children}</div>
}

DashboardInnerPage.Title = function DashboardInnerSectionTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <>
      <h1
        className={cn("font-heading text-4xl md:text-5xl", className)}
        {...props}
      />
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
