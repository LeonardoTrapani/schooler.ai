import { DialogProps } from "@radix-ui/react-alert-dialog"

import { PromptResponse } from "@/types/openai/response.type"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ScheduleDialogProps extends DialogProps {
  promptResponse: PromptResponse | undefined
}

export function ScheduleDialog(props: ScheduleDialogProps) {
  const handleApply = () => {
    if (!props.onOpenChange) return
    props.onOpenChange(false)
  }

  const handleCancel = () => {
    if (!props.onOpenChange) return
    props.onOpenChange(false)
  }

  return (
    <Dialog {...props}>
      <DialogContent size="large">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            <p>This is the AI generated schedule</p>
            <p>
              <b>Score: </b>
              {props.promptResponse?.score}/100
            </p>
            <div>
              <b>AI Notes: </b>
              {props.promptResponse?.notes.map((note) => (
                <p>{note}</p>
              ))}
            </div>
            <div>
              <b>Scheduled Classes: </b>
              {props.promptResponse?.sections.map((section) => (
                <div>
                  <b>SectionID: {section.sectionId}</b>
                  {section.classes.map((classItem) => (
                    <div>
                      <p>ClassId: {classItem.classId}</p>
                      <p>ProfessorID: {classItem.professorId}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p>Do you want to apply this to your schedule?</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCancel} variant="secondary">
            Undo
          </Button>
          <Button onClick={handleApply} variant="default">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
