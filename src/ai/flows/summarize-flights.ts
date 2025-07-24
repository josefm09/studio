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
  origin: z.string().describe('The origin airport code.'),
  destination: z.string().describe('The destination airport code.'),
  date: z.string().describe('The date of the flight (YYYY-MM-DD).'),
});
export type SummarizeFlightsInput = z.infer<typeof SummarizeFlightsInputSchema>;

const SummarizeFlightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the available daytime flights, sorted by price.'),
  flights: z.array(
    z.object({
      departureTime: z.string().describe('The departure time of the flight.'),
      arrivalTime: z.string().describe('The arrival time of the flight.'),
      price: z.number().describe('The price of the flight in USD.'),
    })
  ).
describe('A list of available daytime flights, sorted by price.'),
});
export type SummarizeFlightsOutput = z.infer<typeof SummarizeFlightsOutputSchema>;

export async function summarizeFlights(input: SummarizeFlightsInput): Promise<SummarizeFlightsOutput> {
  return summarizeFlightsFlow(input);
}

const summarizeFlightsPrompt = ai.definePrompt({
  name: 'summarizeFlightsPrompt',
  input: {schema: SummarizeFlightsInputSchema},
  output: {schema: SummarizeFlightsOutputSchema},
  prompt: `You are a travel agent specializing in finding the best daytime flights for your clients.

  Given the origin, destination, and date, summarize the available daytime flights, sorted by price.
  Exclude any flights that depart or arrive at night (10 PM - 6 AM local time).

  Origin: {{{origin}}}
  Destination: {{{destination}}}
  Date: {{{date}}}
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
