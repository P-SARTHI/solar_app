
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationInput, CalculationResult, AIAdvice } from "../types";

export const getAIAdvice = async (input: CalculationInput, result: CalculationResult): Promise<AIAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `As a solar energy consultant from "Parth solar solutions", analyze this installation for a customer in ${input.state}:
  Monthly Bill: ${input.monthlyConsumption} units
  System Size: ${result.requiredKW} kW
  Panel Type: ${input.selectedPanelType}
  Estimated Total Cost: ₹${result.estimatedCost.toFixed(0)}
  Central Subsidy (PM Surya Ghar): ₹${result.centralSubsidy}
  State Subsidy: ₹${result.stateSubsidy}
  Net Investment: ₹${result.finalCost.toFixed(0)}
  Payback: ${result.paybackPeriod.toFixed(1)} years

  Provide a concise summary, 3 key benefits (mentioning Net Metering or specific Indian policies), and a recommendation for ${input.state} conditions. Maintain a professional yet encouraging tone.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            benefits: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: { type: Type.STRING }
          },
          required: ["summary", "benefits", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Advice generation failed", error);
    return {
      summary: "Parth solar solutions highly recommends solar for your location under the PM Surya Ghar scheme.",
      benefits: [
        "Eliminate up to 300 units of monthly billing",
        "Fastest ROI with current Indian subsidies",
        "Reliable energy during peak Indian summer"
      ],
      recommendations: "We recommend DCR panels for full subsidy eligibility and long-term durability in local weather."
    };
  }
};
