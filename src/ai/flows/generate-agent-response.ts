'use server';

/**
 * @fileOverview An AI agent response generator.
 *
 * - generateAgentResponse - A function that generates a response from the agent based on a user prompt.
 * - GenerateAgentResponseInput - The input type for the generateAgentResponse function.
 * - GenerateAgentResponseOutput - The return type for the generateAgentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt to send to the agent.'),
});
export type GenerateAgentResponseInput = z.infer<typeof GenerateAgentResponseInputSchema>;

const GenerateAgentResponseOutputSchema = z.object({
  response: z.string().describe('The response from the agent.'),
});
export type GenerateAgentResponseOutput = z.infer<typeof GenerateAgentResponseOutputSchema>;

export async function generateAgentResponse(input: GenerateAgentResponseInput): Promise<GenerateAgentResponseOutput> {
  return generateAgentResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentResponsePrompt',
  input: {schema: GenerateAgentResponseInputSchema},
  output: {schema: GenerateAgentResponseOutputSchema},
  prompt: `You are a helpful AI agent. Please respond to the following prompt: {{{prompt}}}`,
});

const generateAgentResponseFlow = ai.defineFlow(
  {
    name: 'generateAgentResponseFlow',
    inputSchema: GenerateAgentResponseInputSchema,
    outputSchema: GenerateAgentResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      },
    });
    return output!;
  }
);
