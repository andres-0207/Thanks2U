import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. Chatbot Feature
export const sendChatMessage = async (history: string[], message: string) => {
  if (!apiKey) throw new Error("API Key missing");

  const model = "gemini-3-pro-preview"; 
  
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: "You are a friendly, encouraging AI assistant for the Thanks2U platform. Your goal is to help users understand how buying tickets supports student scholarships. Be concise, warm, and helpful.",
      },
      history: history.map((msg, i) => ({
        role: i % 2 === 0 ? "user" : "model",
        parts: [{ text: msg }],
      })),
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Lo siento, tuve un problema al procesar tu mensaje.";
  }
};

// 2. Thinking Mode (Bio Assistant)
export const generateBioWithThinking = async (currentBio: string, major: string, name: string) => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Help write a compelling, emotional, yet professional biography for a student named ${name} studying ${major}. Current draft: "${currentBio}". The bio should encourage people to support their scholarship fund via raffle tickets.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep reasoning
        maxOutputTokens: 2000,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Thinking Error:", error);
    return "Error generating bio.";
  }
};

// 3. Image Analysis (Caption Generator)
export const analyzeImageForCaption = async (base64Image: string) => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    // Remove header if present (data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image and write a short, inspiring social media caption for a student's scholarship journey log. Keep it under 20 words."
          }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Vision Error:", error);
    return "Genial foto para tu historia.";
  }
};