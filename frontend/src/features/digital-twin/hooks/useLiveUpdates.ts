import { useEffect, useState, useCallback } from 'react';
import { wsClient } from '../services/WebSocketClient';
import type { MobileUnit, GateThroughput, WebSocketMessage, ThermalData, CrowdFlowPath } from '../types';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'mock';

export const useLiveUpdates = () => {
  const [units, setUnits] = useState<MobileUnit[]>([]);
  const [gates, setGates] = useState<GateThroughput[]>([]);
  const [thermal, setThermal] = useState<ThermalData[]>([]);
  const [crowdFlows, setCrowdFlows] = useState<CrowdFlowPath[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [latency, setLatency] = useState(0);

  const handleMessage = useCallback((msg: WebSocketMessage) => {
    switch (msg.type) {
      case 'SYNC':
        setUnits(msg.payload.units || []);
        setGates(msg.payload.gates || []);
        setThermal(msg.payload.thermal || []);
        setCrowdFlows(msg.payload.crowdFlows || []);
        setLatency(Math.floor(Math.random() * 20) + 5);
        break;
      case 'UNIT_UPDATE':
        setUnits(prev => {
          const exists = prev.find(u => u.id === msg.payload.id);
          if (exists) {
            return prev.map(u => u.id === msg.payload.id ? msg.payload : u);
          }
          return [...prev, msg.payload];
        });
        break;
      case 'GATE_UPDATE':
        setGates(prev => {
          const exists = prev.find(g => g.gateId === msg.payload.gateId);
          if (exists) {
            return prev.map(g => g.gateId === msg.payload.gateId ? msg.payload : g);
          }
          return [...prev, msg.payload];
        });
        break;
      case 'THERMAL_UPDATE':
        setThermal(msg.payload);
        break;
      case 'CROWD_UPDATE':
        setCrowdFlows(msg.payload);
        break;
    }
  }, []);

  useEffect(() => {
    // Start connecting on mount
    wsClient.connect();
    
    const unsubscribeStatus = wsClient.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    const unsubscribeMessage = wsClient.subscribe(handleMessage);

    return () => {
      unsubscribeStatus();
      unsubscribeMessage();
      wsClient.disconnect();
    };
  }, [handleMessage]);

  return { units, gates, thermal, crowdFlows, connectionStatus, latency };
};
