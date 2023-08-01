import React from "react"
import { useRouter } from "next/navigation"

import { PromptResponse } from "@/types/openai/response.type"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ScheduleApplyButtonProps extends ButtonProps {
  onApplyComplete: () => void
  promptResponse: PromptResponse | undefined
}

export function ScheduleApplyButton({
  className,
  variant,
  onApplyComplete,
  promptResponse,
  ...props
}: ScheduleApplyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const formattedPromptResponse: { classId: string; professorId: string }[] =
      []
    promptResponse?.sections.forEach((section) =>
      formattedPromptResponse.push(
        ...section.classes.map((c) => ({
          classId: c.id,
          professorId: c.professor.id,
        }))
      )
    )
    const response = await fetch("/api/schedule/apply", {
      method: "POST",
      body: JSON.stringify(formattedPromptResponse),
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your schedule was not applied. Please try again.",
        variant: "destructive",
      })
    }

    onApplyComplete()
    router.refresh()
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
        <Icons.forward className="mr-2 h-4 w-4" />
      )}
      Apply
    </button>
  )
}
