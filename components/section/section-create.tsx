"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { postSectionSchema } from "@/lib/validations/section"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

import { toast } from "../ui/use-toast"

interface SectionCreateProps extends DialogProps {
  buttonProps?: ButtonProps
}

type FormData = z.infer<typeof postSectionSchema>

export function SectionCreate({ buttonProps, ...props }: SectionCreateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [creating, setCreating] = React.useState<boolean>(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSectionSchema),
  })

  const onSubmit = async (data: FormData) => {
    setCreating(true)

    const response = await fetch(`/api/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    setCreating(false)

    if (!response?.ok) {
      if (response?.status === 409) {
        return toast({
          title: "Something went wrong.",
          description: "The section already exists. Please try again.",
          variant: "destructive",
        })
      }
      return toast({
        title: "Something went wrong.",
        description: "The section was not created. Please try again.",
        variant: "destructive",
      })
    }

    setOpen(false)

    toast({
      description: `Section ${data.name} created successfully`,
    })

    router.refresh()
  }

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonProps?.variant} {...buttonProps}>
          <Icons.add className="mr-2 h-4 w-4" />
          New section
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
          <DialogDescription>
            Please enter the section name to create a new section.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <Label htmlFor="section">Section Name</Label>
            <Input
              id="name"
              className="max-w-[400px]"
              placeholder="Section Name"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="mt-2">
              {creating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
