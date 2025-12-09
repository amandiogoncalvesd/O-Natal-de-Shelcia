import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateChristmasPoem = async (
  recipient: string,
  themes: string[]
): Promise<string> => {
  if (!apiKey) {
    return "O amor brilha mais forte que qualquer estrela neste Natal. (Chave API não configurada)";
  }

  try {
    const prompt = `
      Escreva um pequeno poema de Natal ou mensagem mágica e inspiradora (máximo 60 palavras) para ${recipient}.
      A mensagem deve ser poética, elegante e incluir referências a estes temas: ${themes.join(', ')}.
      O tom deve ser romântico (estilo Bridgerton/Disney) e celestial.
      Responda apenas com o texto do poema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "Que a magia das estrelas ilumine seu Natal com amor e beleza infinita.";
  } catch (error) {
    console.error("Error generating poem:", error);
    return "Que a luz das estrelas guie seus sonhos para um 2025 repleto de realizações e amor.";
  }
};
