import OpenAI from "openai";

const ai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

export async function generateAiContent(prompt: string) {
  const response = await ai.chat.completions.create({
    model: "moonshotai/kimi-k2.6",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}