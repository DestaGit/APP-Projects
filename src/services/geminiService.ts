import { GoogleGenAI, Type } from "@google/genai";
import { Post } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePostDraft(topic: string): Promise<Partial<Post>> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a high-quality blog post draft about: ${topic}. 
    Follow the "ClarifyPoint" framework:
    1. Identify a specific problem.
    2. Provide a clear, easy-to-digest solution (the "point").
    3. Write in an interesting, accessible way.
    
    Structure:
    - Title: Catchy and clear.
    - Excerpt: One sentence hook.
    - Problem: Description of the pain point.
    - Solution: The core fix.
    - Content: The full blog post in Markdown.
    - Category: One word category.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          problem: { type: Type.STRING },
          solution: { type: Type.STRING },
          content: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["title", "excerpt", "problem", "solution", "content", "category"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {};
  }
}
