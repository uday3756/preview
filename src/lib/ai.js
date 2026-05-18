/**
 * AI Service for Lumina Chat
 * Connects to Google Gemini API (or any other provider)
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export const getAIResponse = async (userMessage, history = []) => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hfKey = import.meta.env.VITE_HF_API_KEY; // Alternative free option

  
  // 1. Try Gemini first
  if (geminiKey) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `You are Lumina AI... ${userMessage}` }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
        }),
      });
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) { console.error("Gemini failed, trying HF...", e); }
  }

  // 2. Try Hugging Face as free alternative
  if (hfKey) {
    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${hfKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: `<s>[INST] You are Lumina AI for a cinema events platform. ${userMessage} [/INST]` }),
      });
      const data = await response.json();
      return data[0]?.generated_text?.split("[/INST]")?.pop()?.trim();
    } catch (e) { console.error("HF failed", e); }
  }

  console.warn("No AI API Keys found or APIs failed. Using fallback.");
  return null;
};
