import { z } from "zod";

export const workTypes = [
  "Corrosion Repair (Light)",
  "Corrosion Repair (Medium)",
  "Corrosion Repair (Heavy)",
  "Head Stock Repair",
  "Lavatory Repair",
] as const;

export const addCoachSchema = z.object({
  coachNumber: z.string().min(2, {
    message: "Coach number must be at least 2 characters.",
  }).max(50, { message: "Coach number must be 50 characters or less."}),
  offeredDate: z.date({
    required_error: "An offered date is required.",
  }),
  workTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one work type.",
  }),
  additionalNotes: z.string().optional(),
});


export const addMaterialSchema = z.object({
  materialName: z.string().min(2, "Material name must be at least 2 characters."),
  materialCode: z.string().min(2, "Material code must be at least 2 characters."),
  unit: z.string().min(1, "Unit is required."),
  stockQuantity: z.coerce.number().default(0),
  minStockLevel: z.coerce.number().default(0),
  description: z.string().optional(),
  ownership: z.enum(["Railway", "SSWPI"], {
    required_error: "You need to select an ownership type.",
  }),
});
