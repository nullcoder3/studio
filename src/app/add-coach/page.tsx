"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addCoachSchema, workTypes } from "@/lib/schemas";
import { useCoaches } from "@/hooks/use-coaches";

export default function AddCoachPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addCoach } = useCoaches();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof addCoachSchema>>({
    resolver: zodResolver(addCoachSchema),
    defaultValues: {
      coachNumber: "",
      workTypes: [],
      additionalNotes: "",
      offeredDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof addCoachSchema>) {
    setIsSubmitting(true);
    
    addCoach({
      coachNumber: values.coachNumber,
      offeredDate: values.offeredDate,
      workTypes: values.workTypes,
      notes: values.additionalNotes,
    });
    
    setIsSubmitting(false);

    toast({
      title: "Coach Added",
      description: `Coach ${values.coachNumber} has been successfully registered.`,
    });
    router.push('/');
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Add New Coach</h1>
        <p className="text-muted-foreground mt-2">Fill in the details to add a new coach to the workshop.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="coachNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coach Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., LHB-001, ICF-045" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offeredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Offered Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
            name="workTypes"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Work Types Required *</FormLabel>
                </div>
                <div className="p-4 border rounded-md space-y-3 max-h-48 overflow-y-auto">
                  {workTypes.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="workTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, item])
                                    : field.onChange(
                                        currentValue.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm">
                              {item}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Coach to Workshop
          </Button>
        </form>
      </Form>
    </div>
  );
}
