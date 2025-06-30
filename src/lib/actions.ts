'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addCoachSchema } from './schemas';
import { addCoachData } from './data';

export async function addCoach(values: z.infer<typeof addCoachSchema>) {
  const validatedFields = addCoachSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data provided. Please check the form.',
    };
  }

  try {
    // Add the coach to our in-memory "database"
    addCoachData({
      coachNumber: validatedFields.data.coachNumber,
      offeredDate: validatedFields.data.offeredDate,
      workTypes: validatedFields.data.workTypes,
      notes: validatedFields.data.additionalNotes,
    });

    // After a successful operation, we revalidate paths
    // to ensure the UI is updated with the latest data.
    revalidatePath('/'); // Revalidate the homepage to show the new coach
    revalidatePath('/add-coach'); // Revalidate the add coach page

    return { success: true, message: 'Coach added successfully!' };

  } catch (error) {
    console.error('Data Error:', error);
    return { 
      success: false, 
      message: 'Failed to save coach due to a server error.' 
    };
  }
}
