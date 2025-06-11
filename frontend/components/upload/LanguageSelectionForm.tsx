import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { use, useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
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

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const detectLanguageOption = { label: "Detect Language", value: "detect" }

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
})

interface LanguageSelectionFormProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  detect?: boolean
}

export function LanguageSelectionForm({ 
  label, 
  value, 
  onValueChange, 
  detect = false 
}: LanguageSelectionFormProps) {
  const availableOptions = detect ? [detectLanguageOption, ...languages] : languages
  const defaultValue = (detect && !value) ? "detect" : value

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: defaultValue
    }
  })

  useEffect(() => { // update form value when prop changes
    const newValue = (detect && !value) ? "detect" : value
    form.setValue("language", newValue)
  }, [value, detect, form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const getPlaceholderText = () => {
    if (detect) {
      return "Detect Language"
    }
    return "Select language"
  }

  const getSelectedLabel = (fieldValue: string) => {
    if (!fieldValue) return null
    
    const selectedOption = availableOptions.find(
      (option) => option.value === fieldValue
    )
    return selectedOption?.label
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="block text-sm font-medium text-gray-700">{label}</FormLabel>
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
                        ? getSelectedLabel(field.value)
                        : getPlaceholderText()}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {availableOptions.map((option) => (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            onSelect={() => {
                              form.setValue("language", option.value)
                              onValueChange(option.value) // callback to FileUpload
                            }}
                          >
                            {option.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                option.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {/* <FormDescription>
                Please select a language.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  )
}