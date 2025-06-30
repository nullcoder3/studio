"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, PackagePlus, HardHat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addMaterialSchema } from "@/lib/schemas";
import { useMaterials } from "@/hooks/use-materials";

export default function AddMaterialPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addMaterial } = useMaterials();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof addMaterialSchema>>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      materialName: "",
      materialCode: "",
      unit: "",
      ownership: "Railway",
      stockQuantity: undefined,
      minStockLevel: undefined,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addMaterialSchema>) {
    setIsSubmitting(true);
    
    addMaterial({
        name: values.materialName,
        materialCode: values.materialCode,
        unit: values.unit,
        ownership: values.ownership,
        stockQuantity: values.stockQuantity,
        minStockLevel: values.minStockLevel,
        description: values.description,
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);

    toast({
      title: "Material Added",
      description: `Material "${values.materialName}" has been successfully registered.`,
    });
    router.push('/'); 
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            <HardHat className="h-8 w-8 text-primary" /> Material Management
        </h1>
        <p className="text-muted-foreground mt-2">Manage workshop materials and inventory.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Material</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Steel Plate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="materialCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., SP001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kg, pieces, liters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Current stock" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock Level</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Minimum stock alert level" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="ownership"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ownership *</FormLabel>
                      <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Railway" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Railway (R)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Material description and usage notes"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4 pt-4">
                 <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                 </Button>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <PackagePlus className="mr-2 h-4 w-4" />
                    )}
                    Add Material
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
