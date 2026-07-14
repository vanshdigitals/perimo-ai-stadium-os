import type { WebSocketMessage, MobileUnit, GateThroughput, ThermalData, CrowdFlowPath } from '../types';
import { BERNA_COORDS, randomizePosition } from '../utils/mapHelpers';

let mockInterval: ReturnType<typeof setInterval> | null = null;

const MOCK_UNITS: MobileUnit[] = [
  { id: 'u-1', type: 'security', position: randomizePosition(BERNA_COORDS, 0.002), status: 'active', lastUpdated: new Date().toISOString(), floor: 'L1' },
  { id: 'u-2', type: 'security', position: randomizePosition(BERNA_COORDS, 0.003), status: 'active', lastUpdated: new Date().toISOString(), floor: 'L2' },
  { id: 'u-3', type: 'medical', position: randomizePosition(BERNA_COORDS, 0.001), status: 'busy', lastUpdated: new Date().toISOString(), floor: 'L1' },
  { id: 'u-4', type: 'police', position: randomizePosition(BERNA_COORDS, 0.004), status: 'active', lastUpdated: new Date().toISOString(), floor: 'P1' },
  { id: 'u-5', type: 'maintenance', position: randomizePosition(BERNA_COORDS, 0.002), status: 'offline', lastUpdated: new Date().toISOString(), floor: 'L3' },
];

const MOCK_GATES: GateThroughput[] = [
  { gateId: 'North A', flowRate: 124, waitLevel: 'low', occupancy: 420, capacity: 5000, securityStatus: 'normal', floor: 'L1', position: randomizePosition(BERNA_COORDS, 0.004) },
  { gateId: 'South B', flowRate: 82, waitLevel: 'low', occupancy: 120, capacity: 3000, securityStatus: 'normal', floor: 'L1', position: randomizePosition(BERNA_COORDS, 0.004) },
  { gateId: 'East C', flowRate: 240, waitLevel: 'high', occupancy: 4800, capacity: 5000, securityStatus: 'heightened', floor: 'L1', position: randomizePosition(BERNA_COORDS, 0.004) }
];

const generateThermalData = (): ThermalData[] => {
  return Array.from({ length: 50 }).map(() => ({
    position: randomizePosition(BERNA_COORDS, 0.005),
    weight: Math.floor(Math.random() * 10),
    floor: Math.random() > 0.5 ? 'L1' : 'L2',
  }));
};

const generateCrowdFlows = (): CrowdFlowPath[] => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `cf-${i}`,
    path: [
      randomizePosition(BERNA_COORDS, 0.005),
      randomizePosition(BERNA_COORDS, 0.004),
      randomizePosition(BERNA_COORDS, 0.003),
    ],
    density: Math.random() > 0.7 ? 'high' : 'medium',
    flowRate: Math.floor(Math.random() * 200),
    floor: 'L1'
  }));
};

export const startMockSimulator = (onMessage: (msg: WebSocketMessage) => void) => {
  if (mockInterval) return;

  // Initial sync payload
  onMessage({
    type: 'SYNC',
    payload: {
      units: MOCK_UNITS,
      gates: MOCK_GATES,
      thermal: generateThermalData(),
      crowdFlows: generateCrowdFlows(),
    },
    timestamp: new Date().toISOString()
  });

  // Generate realistic updates every 3 seconds
  mockInterval = setInterval(() => {
    // 1. Move a random unit
    const unitToMove = MOCK_UNITS[Math.floor(Math.random() * MOCK_UNITS.length)];
    unitToMove.position = randomizePosition(unitToMove.position, 0.0004);
    unitToMove.lastUpdated = new Date().toISOString();
    // Simulate status change
    if (Math.random() > 0.9) {
       unitToMove.status = unitToMove.status === 'active' ? 'busy' : 'active';
    }

    onMessage({
      type: 'UNIT_UPDATE',
      payload: unitToMove,
      timestamp: new Date().toISOString()
    });

    // 2. Sometimes update gate throughput
    if (Math.random() > 0.5) {
      const gateToUpdate = MOCK_GATES[Math.floor(Math.random() * MOCK_GATES.length)];
      gateToUpdate.flowRate = Math.max(0, gateToUpdate.flowRate + (Math.random() > 0.5 ? 20 : -20));
      gateToUpdate.occupancy = Math.max(0, gateToUpdate.occupancy + (Math.random() > 0.5 ? 50 : -50));
      gateToUpdate.waitLevel = gateToUpdate.flowRate > 200 ? 'high' : gateToUpdate.flowRate > 100 ? 'medium' : 'low';
      
      onMessage({
        type: 'GATE_UPDATE',
        payload: gateToUpdate,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Update thermal and crowd occasionally
    if (Math.random() > 0.7) {
       onMessage({
         type: 'THERMAL_UPDATE',
         payload: generateThermalData(),
         timestamp: new Date().toISOString()
       });
    }
    if (Math.random() > 0.7) {
       onMessage({
         type: 'CROWD_UPDATE',
         payload: generateCrowdFlows(),
         timestamp: new Date().toISOString()
       });
    }

  }, 2500);
};

export const stopMockSimulator = () => {
  if (mockInterval) {
    clearInterval(mockInterval);
    mockInterval = null;
  }
};
