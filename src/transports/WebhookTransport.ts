import { LogLevel, Transport } from '../types';
import { stripAnsi } from '../utils/stripAnsi';

export interface WebhookTransportOptions {
    url: string;
    method?: 'POST' | 'PUT';
    headers?: Record<string, string>;
    minLevel?: LogLevel;
}
export class WebhookTransport implements Transport {
    name = 'webhook';
    private url: string;
    private method: 'POST' | 'PUT';
    private headers: Record<string, string>;
    constructor(options: WebhookTransportOptions) {
        this.url = options.url;
        this.method = options.method || 'POST';
        this.headers = options.headers || { 'Content-Type': 'application/json' };
    }
    async log(level: LogLevel, message: string, meta?: any): Promise<void> {
        try {
            const payload = {
                timestamp: new Date().toISOString(),
                level: level.toUpperCase(),
                message: stripAnsi(message),
                meta
            };
            await fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error('[KaiLogger] Webhook transport failed:', e);
        }
    }
}
