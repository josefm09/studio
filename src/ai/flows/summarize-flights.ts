// Summarize daytime flight options, sorted by price, excluding nighttime flights.
'use server';
/**
 * @fileOverview Summarizes available daytime flights, sorted by price, excluding nighttime flights.
 *
 * - summarizeFlights - A function that handles the flight summarization process.
 * - SummarizeFlightsInput - The input type for the summarizeFlights function.
 * - SummarizeFlightsOutput - The return type for the summarizeFlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFlightsInputSchema = z.object({
  origin: z.string().describe('El código del aeropuerto de origen.'),
  destination: z.string().describe('El código del aeropuerto de destino.'),
  date: z.string().describe('La fecha del vuelo (YYYY-MM-DD).'),
});
export type SummarizeFlightsInput = z.infer<typeof SummarizeFlightsInputSchema>;

const SummarizeFlightsOutputSchema = z.object({
  summary: z.string().describe('Un resumen de los vuelos diurnos disponibles, ordenados por precio.'),
  flights: z.array(
    z.object({
      departureTime: z.string().describe('La hora de salida del vuelo.'),
      arrivalTime: z.string().describe('La hora de llegada del vuelo.'),
      price: z.number().describe('El precio del vuelo en MXN.'),
    })
  ).
describe('Una lista de los vuelos diurnos disponibles, ordenados por precio.'),
});
export type SummarizeFlightsOutput = z.infer<typeof SummarizeFlightsOutputSchema>;

export async function summarizeFlights(input: SummarizeFlightsInput): Promise<SummarizeFlightsOutput> {
  return summarizeFlightsFlow(input);
}

const summarizeFlightsPrompt = ai.definePrompt({
  name: 'summarizeFlightsPrompt',
  input: {schema: SummarizeFlightsInputSchema},
  output: {schema: SummarizeFlightsOutputSchema},
  prompt: `Eres un agente de viajes especializado en encontrar los mejores vuelos diurnos para tus clientes.

  Dado el origen, el destino y la fecha, resume los vuelos diurnos disponibles, ordenados por precio.
  Excluye cualquier vuelo que salga o llegue de noche (22:00 - 6:00 hora local).

  Origen: {{{origin}}}
  Destino: {{{destination}}}
  Fecha: {{{date}}}
  `, // Removed media as it was not relevant for text summarization. Use media calls for images only.
});

const summarizeFlightsFlow = ai.defineFlow(
  {
    name: 'summarizeFlightsFlow',
    inputSchema: SummarizeFlightsInputSchema,
    outputSchema: SummarizeFlightsOutputSchema,
  },
  async input => {
    const {output} = await summarizeFlightsPrompt(input);
    return output!;
  }
);
