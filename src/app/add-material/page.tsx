"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { addMaterialSchema } from "@/lib/schemas"

export default function AddMaterialPage() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof addMaterialSchema>>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      materialName: "",
    },
  })

  function onSubmit(values: z.infer<typeof addMaterialSchema>) {
    console.log(values)
    toast({
      title: "Material Added",
      description: `Material "${values.materialName}" has been successfully added.`,
    })
    form.reset()
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Add New Material</CardTitle>
          <CardDescription>
            Register a new material type and specify its ownership.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Brake Pads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ownership"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Ownership</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Railway" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Railway (R)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="SSWPI" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            SSWPI (S)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Wrench className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
