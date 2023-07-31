export type PromptResponse = {
  score: number; //a number between 0 and 100 that represents the accuracy of the schedule. 100 means that all the preferences were met. Following a preference or not affets the score. A high preference affects the score more than a medium preference that affects the score more than a low preference
  notes: string[]; // a list of strings describing the accuracy of the schedule. Any preference not met should me written here
  suggestions: string[]; // a list of string telling the user suggestions to create a schedule where all preferences are met
  scheduledClasses: {
    professorId: string;
    classId: string;
    sectionId: string;
  }[];
};
