"use client"

import React from "react"

import { PromptResponse } from "@/types/openai/response.type"
import { ScheduleDialog } from "@/components/schedule-dialog"

import { ScheduleCalculateButton } from "./schedule-calculate-button"

interface ScheduleOperationsProps {}

export function ScheduleOperations(_props: ScheduleOperationsProps) {
  const [open, setOpen] = React.useState(false)
  const [promptResponse, setPromptResponse] = React.useState<PromptResponse>()

  const handleScheduleCalculateComplete = (promptResponse: PromptResponse) => {
    setPromptResponse(promptResponse)
    setOpen(true)
  }

  const handlePromptApply = () => {
    setPromptResponse(undefined)
    setOpen(false)
  }

  return (
    <>
      <ScheduleCalculateButton
        onScheduleCalculateComplete={handleScheduleCalculateComplete}
      />
      <ScheduleDialog
        open={open}
        onOpenChange={setOpen}
        onPromptApply={handlePromptApply}
        promptResponse={promptResponse}
      />
    </>
  )
}
