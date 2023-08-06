export type PromptRequest = {
  sections: {
    name: string //the name of the section. Use this in the notes instead of the section ID
    id: string //sectionId
    classes: {
      id: string //classId
      start: string //the start of the class in the format HH:MM (or H:MM)
      end: string //the end of the class in the format HH:MM (or H:MM)
      day: number // 1 is Monday, 2 is Tuesday, etc. Could arrive to more than 7 in case of multiple weeks. For example 8 would be the second Monday
      professorId: string | null //if null it means that you should assign the class to a professor. If specified it should be tried to keep it like that. The user should know in the notes if the current one should be changed to have a better schedule.
      sectionId: string | null //if null it means that you should assing the class to a professor. If specified it should be tried to keep it like that. The user should know in the notes if the current one should be changed to have a better schedule.
    }[]
  }[]
  professors: {
    id: string //professorId
    name: string //the name of the professor. Use this in the notes instead of the professor ID
    professorSections: {
      totalClasses: number //number of classes that the professor has in that section with that subject
      sectionId: string
      subject: {
        name: string //The name of the subject that that professor will teach in those classes in that section
        id: string //subjectId
      }[]
    }[]
  }[]
  preferences: {
    professorId: string | null //if null specified it means that the preference is a preference for all the professors. If specified the preference if only for that professor.
    sectionId: string | null //if null it means that the preference is a preference for all the sections. If specified the preference is only for that section.
    preference: string //a string describing the preference of the professor
    importance: "HIGH" | "MEDIUM" | "LOW" //the importance of the preference. High ones will have the priority, followed by the medium ones and the low ones.
  }[]
}
