import { Type } from '@google/genai';
import type { AIRecommendation, DashboardContext } from '../types';
import { geminiServiceManager, GeminiConfigError, GeminiAllKeysFailedError } from './gemini';

export class GeminiRecommendationService {
  /**
   * Analyzes the current live dashboard context and returns operational recommendations.
   * Throttling and caching should be handled by the hook calling this service.
   *
   * Primary/Backup key selection, retries and backoff are entirely delegated to
   * `geminiServiceManager` — this method only knows how to build the request and
   * parse the response.
   */
  static async generateRecommendations(context: DashboardContext): Promise<AIRecommendation[]> {
    // Summarize the context to avoid sending massive JSON payloads if they grow large.
    // For now, we send a simplified version of the state.
    const simplifiedContext = {
      timestamp: new Date().toISOString(),
      gateStatus: context.gates.map(g => ({
        id: g.gateId,
        occupancy: `${g.occupancy}/${g.capacity}`,
        flowRate: g.flowRate,
        waitLevel: g.waitLevel,
        securityStatus: g.securityStatus
      })),
      unitStatus: {
        total: context.units.length,
        busy: context.units.filter(u => u.status === 'busy').length,
        active: context.units.filter(u => u.status === 'active').length,
      },
      crowdCongestion: context.crowdFlows.filter(c => c.density === 'high' || c.density === 'medium').map(c => ({
        id: c.id,
        density: c.density
      })),
      thermalAnomalies: context.thermal.filter(t => t.weight > 0.8).length
    };

    const prompt = `
You are the AI Operations Copilot for PERIMO, a Smart Stadiums & Tournament Operations platform.
Analyze the following live dashboard state and generate critical operational recommendations.
Do not generate generic responses. Be specific, actionable, and calm.
Never execute actions automatically; you are only recommending them.

Current Dashboard State:
${JSON.stringify(simplifiedContext, null, 2)}

Provide your response as a JSON array of recommendations.
`;

    const schema = {
      type: Type.ARRAY,
      description: "List of operational recommendations.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short, punchy title for the recommendation." },
          explanation: { type: Type.STRING, description: "One sentence explanation of the situation." },
          whyItMatters: { type: Type.STRING, description: "Why this requires attention now." },
          confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100." },
          recommendedAction: { type: Type.STRING, description: "The specific action to take." },
          estimatedImpact: { type: Type.STRING, description: "The estimated positive impact of taking this action." },
          classification: {
            type: Type.STRING,
            description: "Severity level",
            enum: ['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
          },
        },
        required: ["title", "explanation", "whyItMatters", "confidence", "recommendedAction", "estimatedImpact", "classification"]
      }
    };

    try {
      // Only the actual network call lives inside `execute` — if it throws, the
      // manager classifies the error, fails over to the Backup key, retries with
      // backoff, and only gives up after exhausting every configured key.
      const rawText = await geminiServiceManager.execute(async (ai) => {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.2,
          }
        });

        if (!response.text) {
          throw new Error('Empty response from Gemini.');
        }
        return response.text;
      });

      return this.parseResponse(rawText);
    } catch (error) {
      // Whatever reaches here is final — never surface the raw error to the UI.
      throw new Error(this.formatErrorMessage(error));
    }
  }

  // JSON parsing happens outside the failover loop on purpose: a malformed
  // response is a data problem, not a key-health problem, so it shouldn't count
  // against either key's failure count or trigger a pointless failover.
  private static parseResponse(text: string): AIRecommendation[] {
    let rawData: any[];
    try {
      rawData = JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse Gemini JSON output", error, text);
      throw new Error("AI returned unreadable data. Please try again.");
    }

    return rawData.map((item: any) => ({
      id: crypto.randomUUID(),
      title: item.title,
      explanation: item.explanation,
      whyItMatters: item.whyItMatters,
      confidence: item.confidence,
      recommendedAction: item.recommendedAction,
      estimatedImpact: item.estimatedImpact,
      classification: item.classification,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    }));
  }

  // Maps every possible failure (config, exhausted failover, parsing) to a
  // single user-safe message. Raw Gemini/API errors — status codes, key hints,
  // stack traces — are never exposed here; they only ever reach the console via
  // GeminiServiceManager's logging.
  private static formatErrorMessage(error: unknown): string {
    if (error instanceof GeminiConfigError) {
      return "AI service configuration error. Please contact the system administrator.";
    }
    if (error instanceof GeminiAllKeysFailedError) {
      return "AI Copilot is temporarily unavailable.";
    }
    return "AI Copilot is temporarily unavailable.";
  }
}
