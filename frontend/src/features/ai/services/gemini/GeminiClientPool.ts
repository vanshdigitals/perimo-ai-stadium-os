import { GoogleGenAI } from '@google/genai';
import type { GeminiKeyConfig, GeminiKeyId } from './types';
import { GeminiConfigError } from './errors';

// Reads API keys from Vite env vars ONLY — never hardcoded. To add a third,
// fourth, etc. key in the future, just add VITE_GEMINI_API_KEY_3,
// VITE_GEMINI_API_KEY_4, ... to .env; no code change needed here.
function loadKeyConfigs(): GeminiKeyConfig[] {
  const env = import.meta.env as Record<string, string | undefined>;
  const configs: GeminiKeyConfig[] = [];

  if (env.VITE_GEMINI_API_KEY) {
    configs.push({ id: 'primary', label: 'Primary', apiKey: env.VITE_GEMINI_API_KEY, priority: 0 });
  }
  if (env.VITE_BACKUP_GEMINI_API_KEY) {
    configs.push({ id: 'backup', label: 'Backup', apiKey: env.VITE_BACKUP_GEMINI_API_KEY, priority: 1 });
  }

  let extraIndex = 3;
  let extraKey = env[`VITE_GEMINI_API_KEY_${extraIndex}`];
  while (extraKey) {
    configs.push({ id: `key_${extraIndex}`, label: `Key ${extraIndex}`, apiKey: extraKey, priority: extraIndex - 1 });
    extraIndex += 1;
    extraKey = env[`VITE_GEMINI_API_KEY_${extraIndex}`];
  }

  return configs.sort((a, b) => a.priority - b.priority);
}

/** Holds one lazily-constructed GoogleGenAI client per configured key
 *  (PrimaryClient, BackupClient, and any additional keys). */
export class GeminiClientPool {
  private configs: GeminiKeyConfig[];
  private clients: Map<GeminiKeyId, GoogleGenAI>;

  constructor(configs: GeminiKeyConfig[] = loadKeyConfigs()) {
    this.configs = configs;
    this.clients = new Map();
  }

  /** Key ids in priority order: ['primary', 'backup', ...]. */
  get orderedKeyIds(): GeminiKeyId[] {
    return this.configs.map((config) => config.id);
  }

  getClient(id: GeminiKeyId): GoogleGenAI {
    const existing = this.clients.get(id);
    if (existing) return existing;

    const config = this.configs.find((candidate) => candidate.id === id);
    if (!config) {
      throw new GeminiConfigError(`No Gemini API key configured for slot "${id}".`);
    }

    const client = new GoogleGenAI({ apiKey: config.apiKey });
    this.clients.set(id, client);
    return client;
  }

  /** Console-log-only label — never shown in the UI. */
  labelFor(id: GeminiKeyId): string {
    return this.configs.find((config) => config.id === id)?.label ?? id;
  }
}
