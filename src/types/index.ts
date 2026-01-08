export type LogLevel = 'debug' | 'info' | 'success' | 'warning' | 'error' | 'silent';
export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    success: 2,
    warning: 3,
    error: 4,
    silent: 5
};
export interface KaiConfig {
    theme?: string;
    level?: LogLevel;
    timestamp?: 'ISO' | 'locale' | 'relative' | 'none';
    silent?: boolean;
    transports?: Transport[];
}
export interface Transport {
    name: string;
    log(level: LogLevel, message: string, meta?: any): void | Promise<void>;
}
export interface Formatter {
    format(level: LogLevel, message: string, timestamp: string, scope?: string): string;
}