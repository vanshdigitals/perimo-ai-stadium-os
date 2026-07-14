import type { WebSocketMessage } from '../types';
import { startMockSimulator, stopMockSimulator } from './MockSimulator';

type MessageHandler = (message: WebSocketMessage) => void;
type StatusHandler = (status: 'connected' | 'disconnected' | 'mock') => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private isUsingMock = false;
  private connectionCount = 0;

  constructor(url: string = import.meta.env.VITE_WSS_ENDPOINT || 'wss://localhost/ws') {
    this.url = url;
  }

  connect() {
    this.connectionCount++;
    if (this.connectionCount > 1) return;
    if (this.isUsingMock) return;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyStatus('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.notifyHandlers(data);
        } catch (e) {
          console.error('[WSS] Parse error', e);
        }
      };

      this.socket.onclose = (event) => {
        this.handleDisconnect(event);
      };

      this.socket.onerror = () => {
        console.warn(`[WSS] Connection failed for URL: ${this.url}. Reason: Network error or server unavailable.`);
      };
    } catch {
      this.handleDisconnect();
    }
  }

  private handleDisconnect(event?: CloseEvent) {
    this.socket = null;
    
    if (event) {
       console.warn(`[WSS] Connection closed for URL: ${this.url}. Code: ${event.code}, Reason: ${event.reason || 'Server unavailable'}`);
    }

    const disableMock = import.meta.env.VITE_DISABLE_MOCK_SIMULATOR === 'true';

    if (!disableMock) {
       this.fallbackToMock();
       return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.notifyStatus('disconnected');
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    } else {
      console.error('[WSS] Max reconnect attempts reached. Backend is unavailable.');
      this.notifyStatus('disconnected');
    }
  }

  private fallbackToMock() {
    this.isUsingMock = true;
    this.notifyStatus('mock');
    startMockSimulator((msg) => this.notifyHandlers(msg));
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.handlers.forEach(handler => handler(message));
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'mock') {
    this.statusHandlers.forEach(handler => handler(status));
  }

  disconnect() {
    this.connectionCount = Math.max(0, this.connectionCount - 1);
    if (this.connectionCount > 0) return;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.isUsingMock) {
      stopMockSimulator();
      this.isUsingMock = false;
    }
    this.handlers.clear();
    this.statusHandlers.clear();
  }
}

export const wsClient = new WebSocketClient();
