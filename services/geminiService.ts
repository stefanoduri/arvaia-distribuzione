import { GoogleGenAI, Type } from "@google/genai";
import { AgriData } from "../types";

export const getInsights = async (data: AgriData[]): Promise<string> => {
  if (data.length === 0) return "Nessun dato disponibile per l'analisi.";

  // Fix: Initializing GoogleGenAI with direct access to process.env.API_KEY as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Create a summary for AI context
  const summary = data.slice(0, 50).map(d => 
    `${d.data}: ${d.prodotto} (${d.tipoParte}) - Peso Tot: ${d.pesoTotale}kg`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analizza questi dati di distribuzione agricola e fornisci un breve riassunto (massimo 3 punti) sui trend principali, anomalie o suggerimenti. 
    Rispondi in italiano.
    Dati:
    ${summary}`,
    config: {
      temperature: 0.7,
      topP: 0.9,
    }
  });

  // Use the .text property directly instead of calling .text() as a method
  return response.text || "Impossibile generare approfondimenti al momento.";
};