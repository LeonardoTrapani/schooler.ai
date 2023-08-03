"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ProfessorCreateButtonProps extends ButtonProps {}

export function ProfessorCreateButton({
  className,
  variant,
  ...props
}: ProfessorCreateButtonProps) {
  async function onClick() {}

  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New professor
    </button>
  )
}
