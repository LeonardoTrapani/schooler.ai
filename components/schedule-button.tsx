"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { ButtonProps, buttonVariants } from "./ui/button"
import { toast } from "./ui/use-toast"

interface ScheduleButtonProps extends ButtonProps {}

export function ScheduleButton({
  className,
  variant,
  ...props
}: ScheduleButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/schedule", {
      method: "POST",
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your schedule was not calculated. Please try again.",
        variant: "destructive",
      })
    }

    // This forces a cache invalidation.
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
        <Icons.ai className="mr-2 h-4 w-4" />
      )}
      New post
    </button>
  )
}
