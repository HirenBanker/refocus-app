
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFocusTip = async (durationLabel: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is starting a focus session for ${durationLabel}. Provide a short, powerful motivational quote or focus tip (under 20 words).`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text || "Focus on your goals, not your distractions.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Stay focused and productive!";
  }
};
