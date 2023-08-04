"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { postPreferenceSchema } from "@/lib/validations/preference"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type PreferenceCreateProps = DialogProps & {
  buttonProps?: ButtonProps
} & {
  from?: "section" | "professor" | undefined
  sectionId?: string
  professorId?: string
}

type FormData = z.infer<typeof postPreferenceSchema>

export function PreferenceCreate({
  buttonProps,
  ...props
}: PreferenceCreateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [creating, setCreating] = React.useState<boolean>(false)

  const form = useForm<FormData>({
    resolver: zodResolver(postPreferenceSchema),
  })

  const onSubmit = async (data: FormData) => {
    setCreating(true)

    const response = await fetch(`/api/preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preference: data.preference,
        professorId: props.professorId,
        sectionId: props.sectionId,
        importance: data.importance,
      }),
    })

    setCreating(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "The preference was not created. Please try again.",
        variant: "destructive",
      })
    }

    setOpen(false)

    toast({
      description: `Preference created successfully`,
    })

    router.refresh()
  }

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonProps?.variant} {...buttonProps}>
          <Icons.add className="mr-2 h-4 w-4" />
          New preference
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Preference</DialogTitle>
          <DialogDescription>
            Please enter the preference name and his information to create a new
            preference.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preference</FormLabel>
                  <Input
                    id="name"
                    className="max-w-[400px]"
                    placeholder={
                      props.from === "professor"
                        ? "He can not teach after 10:00 AM"
                        : props.from === "section"
                        ? "Professors can teach maximum 2 classes in a row"
                        : "Professors can teach maximum 3 classes in a row"
                    }
                    size={32}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importance</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="max-w-[400px]">
                      <SelectValue placeholder="Select an importance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Importance</SelectLabel>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="mt-2">
                {creating && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Preference
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
