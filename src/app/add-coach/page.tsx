"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { addCoachSchema } from "@/lib/schemas"

export default function AddCoachPage() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof addCoachSchema>>({
    resolver: zodResolver(addCoachSchema),
    defaultValues: {
      coachNumber: "",
      workType: "",
      initialMaterial: "",
    },
  })

  function onSubmit(values: z.infer<typeof addCoachSchema>) {
    console.log(values)
    toast({
      title: "Coach Added",
      description: `Coach ${values.coachNumber} has been successfully registered.`,
    })
    form.reset()
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Add New Coach</CardTitle>
          <CardDescription>Enter the details for the new coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="coachNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coach Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., C-301" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOffered"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Offered</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Work</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General Overhaul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="initialMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Material Used (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe any initial materials used..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This can be updated later from the coach details page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Coach
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
