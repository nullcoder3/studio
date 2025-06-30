'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addCoachSchema } from './schemas';

// This function simulates saving data to a database.
// In a real application, you would replace the console.log
// with database logic (e.g., using an ORM like Prisma or a DB driver).
async function saveCoachToDatabase(coachData: z.infer<typeof addCoachSchema>) {
  console.log('--- Simulating Save to DB ---');
  console.log('Received data:', coachData);
  console.log('A new coach would be created/updated in the database.');
  // Example: await db.coach.create({ data: coachData });
  return { success: true, message: 'Data processed successfully.' };
}

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
    // Here we call our "database" function.
    await saveCoachToDatabase(validatedFields.data);

    // After a successful DB operation, we can revalidate paths
    // to ensure the UI is updated with the latest data.
    revalidatePath('/'); // Revalidate the homepage
    revalidatePath('/add-coach'); // Revalidate the add coach page

    return { success: true, message: 'Coach added successfully!' };

  } catch (error) {
    console.error('Database Error:', error);
    return { 
      success: false, 
      message: 'Failed to save coach due to a server error.' 
    };
  }
}
