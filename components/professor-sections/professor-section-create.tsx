"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Professor, Section } from "@prisma/client"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { postProfessorSectionsSchema } from "@/lib/validations/professor-section"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type ProfessorSectionCreateProps = DialogProps & {
  buttonProps?: ButtonProps
} & (
    | {
        from: "section"

        professors: Pick<Professor, "id" | "name">[]
        professorId?: string

        sections?: Pick<Section, "id" | "name">[]
        sectionId: string
      }
    | {
        from: "professor"

        professors?: Pick<Professor, "id" | "name">[]
        professorId: string

        sections: Pick<Section, "id" | "name">[]
        sectionId?: string
      }
    | {
        from?: undefined

        professors?: Pick<Professor, "id" | "name">[]
        professorId?: string

        sections?: Pick<Section, "id" | "name">[]
        sectionId?: string
      }
  )

type FormData = z.infer<typeof postProfessorSectionsSchema>

export function ProfessorSectionCreate({
  buttonProps,
  from,
  sections,
  sectionId,
  professors,
  professorId,
  ...props
}: ProfessorSectionCreateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [adding, setAdding] = React.useState<boolean>(false)
  const form = useForm<FormData>({
    resolver: zodResolver(postProfessorSectionsSchema),
    defaultValues: {
      sectionId,
      professorId,
    },
  })

  const onSubmit = async (data: FormData) => {
    setAdding(true)

    const response = await fetch(`/api/professor-sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    })

    setAdding(false)

    if (!response?.ok) {
      if (response?.status === 409) {
        return toast({
          title: "Something went wrong.",
          description:
            "The professor was already added to this section. Consider editing the professor instead.",
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
      description: `Professor added successfully to section`,
    })

    form.reset()

    router.refresh()
  }

  const formattedProfessors = React.useMemo(
    () =>
      professors?.map((professor) => ({
        label: professor.name,
        value: professor.id,
      })),
    [professors]
  )

  const formattedSections = React.useMemo(
    () =>
      sections?.map((section) => ({
        label: section.name,
        value: section.id,
      })),
    [sections]
  )

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonProps?.variant} {...buttonProps}>
          <Icons.add className="mr-2 h-4 w-4" />
          Add professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Professor</DialogTitle>
          <DialogDescription>
            Please choose a professor and the total classes he/she will teach in
            this section.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {formattedProfessors && (
              <FormField
                control={form.control}
                name="professorId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Professor</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? formattedProfessors.find(
                                  (professor) => professor.value === field.value
                                )?.label
                              : "Select a professor..."}
                            <Icons.open className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search professor..." />
                          <CommandEmpty>No professor found.</CommandEmpty>
                          <CommandGroup>
                            {formattedProfessors.map((professor) => (
                              <CommandItem
                                value={professor.label}
                                key={professor.value}
                                onSelect={() => {
                                  form.setValue("professorId", professor.value)
                                }}
                              >
                                <Icons.check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    professor.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {professor.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {formattedSections && (
              <FormField
                control={form.control}
                name="sectionId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Section</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? formattedSections.find(
                                  (section) => section.value === field.value
                                )?.label
                              : "Select a section..."}
                            <Icons.open className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search section..." />
                          <CommandEmpty>No section found.</CommandEmpty>
                          <CommandGroup>
                            {formattedSections.map((section) => (
                              <CommandItem
                                value={section.label}
                                key={section.value}
                                onSelect={() => {
                                  form.setValue("professorId", section.value)
                                }}
                              >
                                <Icons.check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    section.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {section.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="totalClasses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="professor">Total Classes</FormLabel>
                  <Input
                    id="name"
                    type="number"
                    className="max-w-[400px]"
                    placeholder="4"
                    size={32}
                    {...field}
                  />
                  <FormDescription>
                    The total classes the professor will teach in this class.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {adding && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Professor
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
