import { DashboardInnerPage } from "@/components/dashboard-inner-page"
import { PreferenceCreate } from "@/components/preference/preference-create"
import { ProfessorSectionCreate } from "@/components/professor-sections/professor-section-create"

export default function Loading() {
  return (
    <DashboardInnerPage.Skeleton>
      <DashboardInnerPage.SectionSkeleton
        title="Schedule"
        subtitle="All the classes, professors and subjects scheduled for this section"
      ></DashboardInnerPage.SectionSkeleton>
      <DashboardInnerPage.SectionSkeleton
        title="Professors"
        subtitle="All the professors that teach in this class"
      >
        <ProfessorSectionCreate />
      </DashboardInnerPage.SectionSkeleton>
      <DashboardInnerPage.SectionSkeleton
        title="Preferences"
        subtitle="All the preferences of this section. Use them to create a schedule that fits your needs with our AI"
      >
        <PreferenceCreate />
      </DashboardInnerPage.SectionSkeleton>
    </DashboardInnerPage.Skeleton>
  )
}
