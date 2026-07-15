import type { AIRecommendation, DashboardContext } from '../types';
import { apiClient } from '../../../platform/api/client';

export class GeminiRecommendationService {
  /**
   * Analyzes the current live dashboard context and returns operational recommendations.
   * Throttling and caching should be handled by the hook calling this service.
   *
   * Primary/Backup key selection, retries and backoff are entirely delegated to
   * the backend.
   */
  static async generateRecommendations(context: DashboardContext): Promise<AIRecommendation[]> {
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

    try {
      // Call the backend AI Copilot endpoint which handles Gemini and fallbacks securely.
      const response = await apiClient.post<AIRecommendation[]>('/v1/copilot/recommendations', simplifiedContext);
      return response;
    } catch (error) {
      console.error("AI Copilot request failed", error);
      throw new Error("AI Copilot is temporarily unavailable.");
    }
  }
}
