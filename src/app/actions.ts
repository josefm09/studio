'use server';

import {
  summarizeFlights,
  type SummarizeFlightsInput,
  type SummarizeFlightsOutput,
} from '@/ai/flows/summarize-flights';
import { z } from 'zod';

const ActionInputSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
});

export async function findFlightsAction(
  input: SummarizeFlightsInput
): Promise<{ data?: SummarizeFlightsOutput; error?: string }> {
  const parsed = ActionInputSchema.safeParse(input);
  if (!parsed.success) {
    console.error('Invalid input:', parsed.error);
    return { error: 'Los datos de búsqueda no son válidos.' };
  }

  try {
    const output = await summarizeFlights(parsed.data);
    return { data: output };
  } catch (e) {
    console.error('Error fetching flight summary:', e);
    return {
      error:
        'Hubo un problema al buscar los vuelos. Por favor, inténtalo de nuevo más tarde.',
    };
  }
}
