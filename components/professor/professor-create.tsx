"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { postProfessorSchema } from "@/lib/validations/professor"
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface ProfessorCreateProps extends DialogProps {
  buttonProps?: ButtonProps
}

type FormData = z.infer<typeof postProfessorSchema>

export function ProfessorCreate({
  buttonProps,
  ...props
}: ProfessorCreateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [creating, setCreating] = React.useState<boolean>(false)
  const form = useForm<FormData>({
    resolver: zodResolver(postProfessorSchema),
  })

  const onSubmit = async (data: FormData) => {
    setCreating(true)

    const response = await fetch(`/api/professors`, {
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
          description: "The professor already exists. Please try again.",
          variant: "destructive",
        })
      }
      return toast({
        title: "Something went wrong.",
        description: "The professor was not created. Please try again.",
        variant: "destructive",
      })
    }

    setOpen(false)

    toast({
      description: `Professor ${data.name} created successfully`,
    })

    form.reset()

    router.refresh()
  }

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonProps?.variant} {...buttonProps}>
          <Icons.add className="mr-2 h-4 w-4" />
          New professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Professor</DialogTitle>
          <DialogDescription>
            Please enter the professor name and his information to create a new
            professor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="professor">Professor Name</FormLabel>
                  <Input
                    id="name"
                    className="max-w-[400px]"
                    placeholder="Professor Name"
                    size={32}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {creating && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Professor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
