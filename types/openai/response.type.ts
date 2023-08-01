export type PromptResponse = {
  score: number //a number between 0 and 100 that represents the accuracy of the schedule. 100 means that all the preferences were met. Following a preference or not affets the score. A high preference affects the score more than a medium preference that affects the score more than a low preference
  notes: string[] // a list of strings describing the accuracy of the schedule. Any preference not met should me written here. There should always be at least one item. Never mention that the request was a JSON. Also include some suggestions if there are some (for example: "if professor 1 could teach on monday we could get a score of 100).
  sections: {
    sectionId: string
    classes: {
      classId: string
      professorId: string
    }[]
  }[]
}
