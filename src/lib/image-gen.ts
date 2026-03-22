/**
 * Server-side image generation utility.
 * Node.js only — do NOT import from client components.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type ImageResult = { imageBase64: string; mimeType: string };

export async function generateGeminiImage(prompt: string): Promise<ImageResult> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-exp",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ["IMAGE"] } as never,
  });

  const parts = result.response.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData);
  if (!imagePart?.inlineData) throw new Error("No image returned from Gemini");

  return {
    imageBase64: imagePart.inlineData.data!,
    mimeType: imagePart.inlineData.mimeType!,
  };
}
