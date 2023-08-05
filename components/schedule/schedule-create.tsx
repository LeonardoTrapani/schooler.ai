"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { classSchema } from "@/lib/validations/class"
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type ScheduleCreateProps = DialogProps & {
  buttonProps?: ButtonProps
  section: {
    id: string
    name: string
  }
} & {}
type FormData = z.infer<typeof classSchema>

export function ScheduleCreate({
  buttonProps,
  section,
  ...props
}: ScheduleCreateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState<boolean>(false)
  const [creating, setCreating] = React.useState<boolean>(false)

  const [scheduleDays, setScheduleDays] = React.useState<
    {
      classes: Pick<FormData, "start" | "end" | "sectionId">[]
    }[]
  >([
    {
      classes: [],
    },
  ])

  const form = useForm<FormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      sectionId: section.id,
    },
  })

  const onFormSubmit = (data: FormData) => {
    if (data.day > scheduleDays.length) {
      toast({
        title: "Invalid day",
        description: "Please reselect a day before resubmitting.",
        variant: "destructive",
      })
      return
    }

    if (classEditing) {
      setScheduleDays((scheduleDays) => {
        const newScheduleDays = [...scheduleDays]
        newScheduleDays[classEditing.dayIndex].classes[
          classEditing.classIndex
        ] = data
        return newScheduleDays
      })
      setClassEditing(null)
    } else {
      setScheduleDays((scheduleDays) => {
        const newScheduleDays = [...scheduleDays]
        newScheduleDays[data.day - 1] = {
          ...newScheduleDays[data.day - 1],
          classes: [...newScheduleDays[data.day - 1].classes, data],
        }
        return newScheduleDays
      })
    }

    form.reset({
      start: "",
      end: "",
      day: scheduleDays.length + 1,
      sectionId: section.id,
    })
  }

  const onSubmit = async () => {
    setCreating(true)

    const formattedScheduleDays: FormData[] = []
    scheduleDays.forEach((scheduleDay, i) => {
      scheduleDay.classes.forEach((classData) => {
        formattedScheduleDays.push({ ...classData, day: i + 1 })
      })
    })

    const response = await fetch(`/api/schedule/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedScheduleDays),
    })

    setCreating(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "The classes were not created. Please try again.",
        variant: "destructive",
      })
    }

    setOpen(false)

    toast({
      description: `Schedule created successfully`,
    })

    form.reset({
      start: "",
      end: "",
      day: 1,
      sectionId: section.id,
    })

    router.refresh()
  }

  const onDayAdd = () => {
    setClassEditing(null)
    setScheduleDays((scheduleDays) => {
      const newScheduleDays = [...scheduleDays]
      newScheduleDays.push({
        classes: [...scheduleDays[scheduleDays.length - 1].classes],
      })
      return newScheduleDays
    })
    form.reset({
      start: "",
      end: "",
      day: scheduleDays.length + 1,
      sectionId: section.id,
    })
  }

  const onDayDelete = (day: number) => {
    form.reset({
      start: "",
      end: "",
      sectionId: section.id,
    })
    setClassEditing(null)
    setScheduleDays((scheduleDays) => {
      const newScheduleDays = [...scheduleDays]
      newScheduleDays.splice(day, 1)
      if (newScheduleDays.length === 0) {
        newScheduleDays.push({
          classes: [],
        })
      }
      return newScheduleDays
    })
  }

  const [classEditing, setClassEditing] = React.useState<{
    dayIndex: number
    classIndex: number
  } | null>(null)

  const onClassEdit = (
    dayIndex: number,
    classIndex: number,
    data: Pick<FormData, "end" | "start" | "sectionId">
  ) => {
    form.setValue("start", data.start)
    form.setValue("end", data.end)
    form.setValue("day", dayIndex + 1)

    setClassEditing({
      dayIndex,
      classIndex,
    })
  }
  const onClassDelete = (dayIndex: number, classIndex: number) => {
    setScheduleDays((scheduleDays) => {
      const newScheduleDays = [...scheduleDays]
      newScheduleDays[dayIndex].classes.splice(classIndex, 1)
      return newScheduleDays
    })
  }

  return (
    <Dialog {...props} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonProps?.variant} {...buttonProps}>
          <Icons.add className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
          <DialogDescription>
            Create multiple days and add classes to them.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[40vh] overflow-scroll">
          {scheduleDays.map((scheduleDay, i) => (
            <ScheduleDay
              i={i}
              key={i}
              classes={scheduleDay.classes}
              onDayDelete={onDayDelete}
              onClassEdit={onClassEdit}
              onClassDelete={onClassDelete}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onDayAdd}>
          Add a Day
        </Button>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onFormSubmit)}
              className="flex flex-col justify-center gap-2 border p-2 rounded-md"
            >
              <div className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Start</FormLabel>
                      <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class End</FormLabel>
                      <FormControl>
                        <Input placeholder="HH:MM" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(+value)}
                        value={form.watch("day")?.toString() || ""}
                      >
                        <SelectTrigger
                          className="min-w-[70px]"
                          disabled={!!classEditing}
                        >
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Day</SelectLabel>
                            {scheduleDays.map((_scheduleDay, i) => (
                              <SelectItem value={(i + 1).toString()} key={i}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" variant="secondary">
                {classEditing ? "Edit Class" : "Create Class"}
              </Button>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="mt-2"
          >
            {creating && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ScheduleDayProps {
  i: number
  classes: Pick<FormData, "start" | "sectionId" | "end">[]
  onDayDelete: (i: number) => void
  onClassEdit: (
    dayI: number,
    classI: number,
    classData: Pick<FormData, "start" | "sectionId" | "end">
  ) => void
  onClassDelete: (dayI: number, classI: number) => void
}

function ScheduleDay({
  i,
  classes,
  onDayDelete,
  onClassEdit,
  onClassDelete,
}: ScheduleDayProps) {
  return (
    <div>
      <div className="p-2 rounded">
        <div className="flex justify-between">
          <h3 className="font-semibold">Day {i + 1}</h3>
          <button onClick={() => onDayDelete(i)}>
            <Icons.trash className="h-4 w-4" />
          </button>
        </div>
        {classes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No classes added yet.</p>
        ) : (
          <ul className="flex flex-col">
            {classes.map((classData, j) => (
              <li key={j} className="flex items-center gap-2">
                <p className="text-slate-300">
                  {classData.start} - {classData.end}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => onClassEdit(i, j, classData)}>
                    <Icons.edit className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => onClassDelete(i, j)}>
                    <Icons.trash className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Separator className="mt-0" />
    </div>
  )
}
