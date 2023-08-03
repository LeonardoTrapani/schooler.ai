"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SectionCreateButtonProps extends ButtonProps {}

export function SectionCreateButton({
  className,
  variant,
  ...props
}: SectionCreateButtonProps) {
  async function onClick() {}

  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New Section
    </button>
  )
}
