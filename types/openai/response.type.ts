export type PromptResponse = {
  score: number //a number between 0 and 100 that represents the accuracy of the schedule. 100 means that all the preferences were met. Following a preference or not affets the score. A high preference affects the score more than a medium preference that affects the score more than a low preference
  notes: string[] // a list of strings describing the accuracy of the schedule. Any preference not met should me written here. There should always be at least one note. Never mention that the request was a JSON. Also include some suggestions if there are some (for example:  or "a higher score could be achieved if you swap the classes of [another professor 1] and [professor name] bacause...").
  sections: {
    id: string //section ID
    name: string //section name.
    classes: {
      id: string //class ID
      professor: {
        id: string //professor ID
        name: string //the name of the professor. The professor name should be the same for the same professor id as the request in the request
      }
      subject: {
        name: string //the name of the subject. The subject name should be the same for the same subject id as the request in the request
        id: string //subject ID
      }
    }[]
  }[]
}
