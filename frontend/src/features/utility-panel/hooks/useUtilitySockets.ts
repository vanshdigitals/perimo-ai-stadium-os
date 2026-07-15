import { useEffect } from 'react';

// Lightweight WebSocket manager for UI events
class UtilitySocketManager {
  private listeners: Record<string, ((data: any) => void)[]> = {};

  // Mocking the event emission since we don't have a real backend WS yet
  constructor() {
    setInterval(() => {
      // Simulate random background events occasionally
      if (Math.random() > 0.8) {
        this.emit('new_alert', { id: Math.random().toString(), text: 'Test live alert', level: 'warning', type: 'system' });
      }
    }, 15000);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const utilitySockets = new UtilitySocketManager();

export function useUtilitySockets(event: string, callback: (data: any) => void) {
  useEffect(() => {
    const unsubscribe = utilitySockets.on(event, callback);
    return unsubscribe;
  }, [event, callback]);
}
