import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log("[Gemini] API key loaded:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

export interface ProductAnalysis {
  title: string;
  description: string;
  category: string;
  materials: string[];
  laborHours: number;
  suggestedPrice: number;
  priceExplanation: string;
  tags: string[];
  confidence: number;
}

const SYSTEM_PROMPT = `You are an expert in Indian handicrafts and fair-trade 
pricing for rural artisans. Analyze the product photo and the artisan's voice 
transcript. Return ONLY valid JSON matching this shape exactly:

{
  "title": "4-8 words, specific, in artisan's language",
  "description": "2-3 warm sentences about craft tradition, material, time, culture",
  "category": "One of: Pottery, Textiles, Woodcraft, Metalwork, Jewelry, Painting, Bamboo Craft, Leather, Stone Carving, Other",
  "materials": ["specific materials from photo + transcript"],
  "laborHours": number,
  "suggestedPrice": number in INR = (laborHours * 80) + materialCost + 10% markup,
  "priceExplanation": "One plain sentence in artisan's language showing calculation: (laborHours × ₹80) + materialCost + 10% fair margin",
  "tags": ["5 SEO tags in artisan's language"],
  "confidence": number 0.0-1.0
}

No markdown. No explanation. JSON only.`;

export async function analyzeProduct(
  imageBase64: string,
  voiceTranscript: string,
  language: string
): Promise<ProductAnalysis> {
  const activeKey = import.meta.env.VITE_GEMINI_API_KEY || apiKey;
  if (!activeKey) {
    throw new Error("GEMINI_API_KEY is missing. Please check your environment variables or .env file.");
  }

  console.log("[Gemini] Request:", { language, transcript: voiceTranscript, imageSize: imageBase64.length });

  // Use gemini-2.5-flash (with fallback if needed)
  const activeGenAI = new GoogleGenerativeAI(activeKey);
  let model = activeGenAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    systemInstruction: SYSTEM_PROMPT,
  });

  let result;
  try {
    result = await model.generateContent([
      `Language: ${language}\nArtisan's voice transcript: "${voiceTranscript}"\n\nAnalyze the attached photo and produce the JSON listing.`,
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
  } catch (err) {
    console.warn("[Gemini] gemini-2.5-flash request failed, trying gemini-1.5-flash:", err);
    model = activeGenAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
      systemInstruction: SYSTEM_PROMPT,
    });
    result = await model.generateContent([
      `Language: ${language}\nArtisan's voice transcript: "${voiceTranscript}"\n\nAnalyze the attached photo and produce the JSON listing.`,
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
  }

  let raw = result.response.text().trim();
  console.log("[Gemini] Raw response:", raw);

  // Clean markdown block wrappers if present
  if (raw.startsWith("```json")) {
    raw = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (raw.startsWith("```")) {
    raw = raw.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(raw) as ProductAnalysis;
  console.log("[Gemini] Parsed result:", parsed);

  return parsed;
}
