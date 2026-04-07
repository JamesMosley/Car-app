'use server';

import { ai } from '@/ai/ai-instance';

export async function generateChatResponse(messages: {role: 'user' | 'model', content: string}[]) {
  try {
    // Map the simple messages format to the format expected by Genkit
    // Find the first user message to start from (Gemini requires first msg to be user)
    const firstUserIndex = messages.findIndex(m => m.role === 'user');
    const relevantMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;
    const genkitMessages = relevantMessages.map(msg => ({
      role: msg.role === 'model' ? 'model' as const : 'user' as const,
      content: [{ text: msg.content }]
    }));

    const response = await ai.generate({
      messages: genkitMessages,
      system: "You are a helpful AI assistant for GarageHub, a car and garage management platform. Keep your answers concise, friendly, and helpful.",
    });

    return { success: true, text: response.text };
  } catch (error) {
    console.error("Failed to generate chat response:", error);
    return { success: false, text: "I'm sorry, I encountered an error connecting to my brain. Please try again later." };
  }
}

