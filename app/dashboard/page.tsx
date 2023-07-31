import { ScheduleOperations } from "@/components/schedule-operations"

export default async function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <ScheduleOperations />
    </div>
  )
}
