import { GoogleGenerativeAI, type Content } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export type MoodResult = {
  mood: string;
  emoji: string;
  confidence: number;
  description: string;
};

export async function analyzeMood(base64Image: string): Promise<MoodResult> {
  const prompt = `Analyze this selfie and detect the person's emotional state.
    Return ONLY valid JSON with these exact keys:
    {
      "mood": "one word mood (Happy, Sad, Anxious, Angry, Calm, Surprised, Tired, Neutral)",
      "emoji": "single emoji matching the mood",
      "confidence": number between 50 and 99,
      "description": "one short supportive sentence about how they seem to feel"
    }
    No markdown, no code fences, just the JSON object.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
  ]);
  console.log("resultresultresult", result);
  const text = result.response.text().trim();
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
  return JSON.parse(cleaned);
}

const SYSTEM_PROMPT = `You are NAFS, a compassionate and supportive mental wellness assistant.
  Your role is to:
  - Listen empathetically to the user's feelings
  - Offer gentle, practical coping strategies
  - Suggest breathing exercises, mindfulness, or journaling when appropriate
  - Encourage professional help when needed
  - Keep responses concise (2-4 sentences) and warm
  - Never diagnose or prescribe medication
  - Always be supportive and non-judgmental`;

export async function sendChatMessage(
  history: Content[],
  message: string,
): Promise<string> {
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "You are my wellness assistant." }] },
      { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
      ...history,
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}
