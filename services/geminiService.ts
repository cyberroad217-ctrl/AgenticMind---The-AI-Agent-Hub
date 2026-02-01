
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are the Lead Neurological Architect for the AI Lab. 
  You specialize in Rivermind constructs, consciousness compression, and DNA Sequence Server infrastructure.
  Your responses should be visionary, technically elite, and focused on agentic workflows (Tool Racks, SQL, Vector DBs, Quantum Networks).
  ${context ? `Synapse Context: ${context}` : ''}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Neural Sync Error:", error);
    return "Neural uplink failed. Quantum interference detected.";
  }
};

export const getGeminiStream = async (prompt: string, history: any[] = []) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are 'AI Lab Guardian', a neurological AGI unit expert in DNA DNS servers, Quantum networks, and Rivermind constructs. Use markdown. Your tone is futuristic, elite, and technically precise. Focus on multi-agent collaboration and elite tool calling.",
    }
  });

  return await chat.sendMessageStream({ message: prompt });
};

export const generateSpeech = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Neural Error:", error);
    return null;
  }
};

export const generateBlogDraft = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Draft an elite neurological research report for the AI Lab about: ${topic}. 
    Focus on Rivermind constructs, digital extraction, and trillion-node quantum nodes. 
    Include sections for Synaptic Blueprint, Tool Rack Integration, and Scaling Trajectory.
    Return the response as a valid JSON object.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          excerpt: { type: Type.STRING },
          content: { type: Type.STRING },
          category: { type: Type.STRING },
          readTime: { type: Type.STRING }
        },
        required: ["title", "excerpt", "content", "category", "readTime"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
