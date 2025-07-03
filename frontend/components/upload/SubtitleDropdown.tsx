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

type VttFile = {
  language: string;
  filename: string;
}

const FormSchema = z.object({
  subtitle: z.string({
    required_error: "Please select a subtitle.",
  }),
})

interface SubtitleDropdownProps {
  vttFiles: VttFile[]
  selectedVttFilename: string | null
  onSelectedVttFilenameChange: (value: string) => void
}

export function SubtitleDropdown({ 
  vttFiles, 
  selectedVttFilename, 
  onSelectedVttFilenameChange
}: SubtitleDropdownProps) {
  const availableOptions = vttFiles
  const defaultValue = selectedVttFilename ?? ""

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subtitle: defaultValue
    }
  })

useEffect(() => { 
  if (selectedVttFilename && availableOptions.some(option => option.filename === selectedVttFilename)) // update form value when selectedVttFilename changes 
    form.setValue("subtitle", selectedVttFilename)
}, [selectedVttFilename, form])

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
    return "Select subtitle"
  }

  const getSelectedLabel = (fieldValue: string) => {
    if (!fieldValue) return null
    
    const selectedOption = availableOptions.find(
      (option) => option.filename === fieldValue
    )
    return selectedOption?.language
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="block text-sm font-medium text-gray-700">
                Current Subtitle: {selectedVttFilename ? getSelectedLabel(selectedVttFilename) : 'None'}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[350px] justify-between",
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
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search language..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No subtitle found.</CommandEmpty>
                      <CommandGroup>
                        {availableOptions.map((option) => (
                          <CommandItem
                            value={option.language}
                            key={option.filename}
                            onSelect={() => {
                              form.setValue("subtitle", option.filename)
                              onSelectedVttFilenameChange(option.filename) // callback to FileUpload
                            }}
                          >
                            {option.language}
                            <Check
                              className={cn(
                                "ml-auto",
                                option.filename === field.value
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