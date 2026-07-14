export interface Coordinates {
  lng: number;
  lat: number;
}

export type UnitType = 'security' | 'medical' | 'maintenance' | 'police';
export type FloorType = 'L3' | 'L2' | 'L1' | 'P1';

export interface MobileUnit {
  id: string;
  type: UnitType;
  position: Coordinates;
  status: 'active' | 'busy' | 'offline';
  lastUpdated: string;
  floor: FloorType;
}

export interface GateThroughput {
  gateId: string;
  flowRate: number; // people per minute
  waitLevel: 'low' | 'medium' | 'high';
  occupancy: number;
  capacity: number;
  securityStatus: 'normal' | 'heightened' | 'critical';
  floor: FloorType;
  position: Coordinates;
}

export interface CrowdFlowPath {
  id: string;
  path: Coordinates[];
  density: 'low' | 'medium' | 'high';
  flowRate: number;
  floor: FloorType;
}

export interface ThermalData {
  position: Coordinates;
  weight: number;
  floor: FloorType;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  action: string;
  timestamp: string;
}

export interface WebSocketMessage<T = any> {
  type: 'SYNC' | 'UNIT_UPDATE' | 'GATE_UPDATE' | 'AI_INSIGHT' | 'CROWD_UPDATE' | 'THERMAL_UPDATE';
  payload: T;
  timestamp: string;
}
