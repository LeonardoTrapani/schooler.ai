import { Command } from "lucide-react"
import { Control } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"

export interface ComboboxProps {
  control: Control<any>
  fieldValue: string
  name: string
  formattedList: { value: string; label: string }[]
  setValue: (field: string, value: string) => void
}
export function Combobox({
  control,
  fieldValue,
  name,
  formattedList,
  setValue,
}: ComboboxProps) {
  return (
    <FormField
      control={control}
      name={fieldValue}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{name}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? formattedList.find(
                        (formattedItem) => formattedItem.value === field.value
                      )?.value
                    : "Select a professor"}
                  <Icons.open className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search professor..." />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {formattedList.map((formattedItem) => (
                    <CommandItem
                      value={formattedItem.value}
                      key={formattedItem.value}
                      onSelect={() => {
                        setValue(fieldValue, formattedItem.value)
                      }}
                    >
                      <Icons.check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formattedItem.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {formattedItem.label}
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
  )
}
