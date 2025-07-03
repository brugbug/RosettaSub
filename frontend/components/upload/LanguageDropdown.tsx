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
  { label: "Spanish", value: "es" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese (Simplified)", value: "zh-CN" },
  { label: "Chinese (Traditional)", value: "zh-TW" },
  { label: "Afrikaans", value: "af" },
  { label: "Albanian", value: "sq" },
  { label: "Amharic", value: "am" },
  { label: "Arabic", value: "ar" },
  { label: "Armenian", value: "hy" },
  { label: "Azerbaijani", value: "az" },
  { label: "Basque", value: "eu" },
  { label: "Belarusian", value: "be" },
  { label: "Bengali", value: "bn" },
  { label: "Bosnian", value: "bs" },
  { label: "Bulgarian", value: "bg" },
  { label: "Catalan", value: "ca" },
  { label: "Cebuano", value: "ceb" },
  { label: "Corsican", value: "co" },
  { label: "Croatian", value: "hr" },
  { label: "Czech", value: "cs" },
  { label: "Danish", value: "da" },
  { label: "Dutch", value: "nl" },
  { label: "Esperanto", value: "eo" },
  { label: "Estonian", value: "et" },
  { label: "Finnish", value: "fi" },
  { label: "Frisian", value: "fy" },
  { label: "Galician", value: "gl" },
  { label: "Georgian", value: "ka" },
  { label: "German", value: "de" },
  { label: "Greek", value: "el" },
  { label: "Gujarati", value: "gu" },
  { label: "Haitian Creole", value: "ht" },
  { label: "Hausa", value: "ha" },
  { label: "Hawaiian", value: "haw" },
  { label: "Hebrew", value: "he" },
  { label: "Hindi", value: "hi" },
  { label: "Hmong", value: "hmn" },
  { label: "Hungarian", value: "hu" },
  { label: "Icelandic", value: "is" },
  { label: "Igbo", value: "ig" },
  { label: "Indonesian", value: "id" },
  { label: "Irish", value: "ga" },
  { label: "Italian", value: "it" },
  { label: "Javanese", value: "jv" },
  { label: "Kannada", value: "kn" },
  { label: "Kazakh", value: "kk" },
  { label: "Khmer", value: "km" },
  { label: "Kinyarwanda", value: "rw" },
  { label: "Kurdish", value: "ku" },
  { label: "Kyrgyz", value: "ky" },
  { label: "Lao", value: "lo" },
  { label: "Latin", value: "la" },
  { label: "Latvian", value: "lv" },
  { label: "Lithuanian", value: "lt" },
  { label: "Luxembourgish", value: "lb" },
  { label: "Macedonian", value: "mk" },
  { label: "Malagasy", value: "mg" },
  { label: "Malay", value: "ms" },
  { label: "Malayalam", value: "ml" },
  { label: "Maltese", value: "mt" },
  { label: "Maori", value: "mi" },
  { label: "Marathi", value: "mr" },
  { label: "Mongolian", value: "mn" },
  { label: "Myanmar (Burmese)", value: "my" },
  { label: "Nepali", value: "ne" },
  { label: "Norwegian", value: "no" },
  { label: "Nyanja (Chichewa)", value: "ny" },
  { label: "Odia (Oriya)", value: "or" },
  { label: "Pashto", value: "ps" },
  { label: "Persian", value: "fa" },
  { label: "Polish", value: "pl" },
  { label: "Portuguese", value: "pt" },
  { label: "Punjabi", value: "pa" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Samoan", value: "sm" },
  { label: "Scots Gaelic", value: "gd" },
  { label: "Serbian", value: "sr" },
  { label: "Sesotho", value: "st" },
  { label: "Shona", value: "sn" },
  { label: "Sindhi", value: "sd" },
  { label: "Sinhala (Sinhalese)", value: "si" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Somali", value: "so" },
  { label: "Sundanese", value: "su" },
  { label: "Swahili", value: "sw" },
  { label: "Swedish", value: "sv" },
  { label: "Tagalog (Filipino)", value: "tl" },
  { label: "Tajik", value: "tg" },
  { label: "Tamil", value: "ta" },
  { label: "Tatar", value: "tt" },
  { label: "Telugu", value: "te" },
  { label: "Thai", value: "th" },
  { label: "Turkish", value: "tr" },
  { label: "Turkmen", value: "tk" },
  { label: "Ukrainian", value: "uk" },
  { label: "Urdu", value: "ur" },
  { label: "Uyghur", value: "ug" },
  { label: "Uzbek", value: "uz" },
  { label: "Vietnamese", value: "vi" },
  { label: "Welsh", value: "cy" },
  { label: "Xhosa", value: "xh" },
  { label: "Yiddish", value: "yi" },
  { label: "Yoruba", value: "yo" },
  { label: "Zulu", value: "zu" },
] as const;

const detectLanguageOption = { label: "Detect Language", value: "detect" }

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a language.",
  }),
})

interface LanguageDropdownProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  detect?: boolean
}

export function LanguageDropdown({ 
  label, 
  value, 
  onValueChange, 
  detect = false 
}: LanguageDropdownProps) {
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
                        "w-[165px] justify-between",
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