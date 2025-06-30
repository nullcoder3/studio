import { z } from "zod";

export const addCoachSchema = z.object({
  coachNumber: z.string().min(2, {
    message: "Coach number must be at least 2 characters.",
  }),
  dateOffered: z.date({
    required_error: "A date is required.",
  }),
  workType: z.string().min(3, {
    message: "Work type must be at least 3 characters."
  }),
  initialMaterial: z.string().optional(),
});

export const addMaterialSchema = z.object({
  materialName: z.string().min(3, {
    message: "Material name must be at least 3 characters.",
  }),
  ownership: z.enum(["Railway", "SSWPI"], {
    required_error: "You need to select an ownership type.",
  }),
});
