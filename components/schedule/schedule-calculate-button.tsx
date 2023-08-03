import React from "react"

import { PromptResponse } from "@/types/openai/response.type"
import { cn } from "@/lib/utils"
import { promptResponseSchema } from "@/lib/validations/openai"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ScheduleCalculateButtonProps extends ButtonProps {
  onScheduleCalculateComplete: (promptResponse: PromptResponse) => void
}

export function ScheduleCalculateButton({
  className,
  variant,
  onScheduleCalculateComplete,
  ...props
}: ScheduleCalculateButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/schedule/calculate", {
      method: "POST",
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description:
          "Your schedule was not calculated properly. Please try again.",
        variant: "destructive",
      })
    }

    const promptResponse = await response.json()
    const parsedPromptResponse = promptResponseSchema.parse(promptResponse)
    onScheduleCalculateComplete(parsedPromptResponse)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.ai className="mr-2 h-4 w-4" />
      )}
      Calculate Schedule
    </button>
  )
}
