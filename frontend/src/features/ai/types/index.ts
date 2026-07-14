export interface DashboardContext {
  gates: any[];
  units: any[];
  crowdFlows: any[];
  thermal: any[];
  [key: string]: any;
}

export type RecommendationClassification = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RecommendationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';

export interface AIRecommendation {
  id: string;
  title: string;
  explanation: string;
  whyItMatters: string;
  confidence: number;
  recommendedAction: string;
  estimatedImpact: string;
  classification: RecommendationClassification;
  timestamp: string;
  status: RecommendationStatus;
}
