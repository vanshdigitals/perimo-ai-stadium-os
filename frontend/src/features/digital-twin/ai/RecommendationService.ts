import type { AIRecommendation } from '../types';

export class RecommendationService {
  /**
   * Stub for fetching Gemini-powered operational recommendations.
   * Currently returns mocked static responses to avoid blocking UI work.
   */
  static async getPredictions(): Promise<AIRecommendation[]> {
    // In future: call Gemini API here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'rec-1',
            title: 'Redirect Crowd to Gate B',
            description: 'Gate C throughput is dropping. Shifting 15% traffic to Gate B will reduce wait times by 4 minutes.',
            confidence: 0.89,
            action: 'Deploy Wayfinding Alert',
            timestamp: new Date().toISOString()
          }
        ]);
      }, 1000);
    });
  }
}
