"use client"

import React from "react"

import { PromptResponse } from "@/types/openai/response.type"
import { ScheduleDialog } from "@/components/schedule-dialog"

import { ScheduleButton } from "./schedule-button"

interface ScheduleOperationsProps {}

export function ScheduleOperations(_props: ScheduleOperationsProps) {
  const [open, setOpen] = React.useState(false)
  const [promptResponse, setPromptResponse] = React.useState<PromptResponse>()

  const handleScheduleComplete = (promptResponse: PromptResponse) => {
    setPromptResponse(promptResponse)
    setOpen(true)
  }

  return (
    <>
      <ScheduleButton onScheduleComplete={handleScheduleComplete} />
      <ScheduleDialog
        open={open}
        onOpenChange={setOpen}
        promptResponse={promptResponse}
      />
    </>
  )
}
