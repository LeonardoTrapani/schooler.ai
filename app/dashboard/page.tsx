import { getSchedule } from "@/lib/backend-functions/schedule"

export default async function Home() {
  const data = await getSchedule()

  return (
    <div>
      <p className="font-bold">Accuracy: {data.score}</p>
      <br />
      <p className="font-bold">Notes:</p>
      {data.notes.map((note, i) => (
        <p key={i}>{note}</p>
      ))}
      <br />
      <p className="font-bold">Suggestions:</p>
      {data.suggestions.map((suggestion, i) => (
        <p key={i}>{suggestion}</p>
      ))}
      <br />
      <p className="font-bold">Schedule:</p>
      <div className="flex flex-col gap-4">
        {data.scheduledClasses.map((scheduledClass, i) => (
          <div key={i}>
            <p>Section: {scheduledClass.sectionId}</p>
            <p>Class: {scheduledClass.classId}</p>
            <p>Professor: {scheduledClass.professorId}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
