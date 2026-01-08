import { KaiConfig, LogLevel, Transport } from '../types';
import { ThemeName } from '../styles/palettes';

const DEFAULT_CONFIG: KaiConfig = {
    theme: 'zen',
    level: 'debug',
    timestamp: 'locale',
    silent: false,
    transports: []
};
class ConfigManager {
    private static instance: ConfigManager;
    private config: KaiConfig = { ...DEFAULT_CONFIG };
    private constructor() {}
    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    configure(options: Partial<KaiConfig>): void {
        this.config = { ...this.config, ...options };
    }
    get<K extends keyof KaiConfig>(key: K): KaiConfig[K] {
        return this.config[key];
    }
    getAll(): KaiConfig {
        return { ...this.config };
    }
    reset(): void {
        this.config = { ...DEFAULT_CONFIG };
    }
    addTransport(transport: Transport): void {
        if (!this.config.transports) this.config.transports = [];
        this.config.transports.push(transport);
    }
    removeTransport(name: string): void {
        if (this.config.transports) {
            this.config.transports = this.config.transports.filter(t => t.name !== name);
        }
    }
}

export const config = ConfigManager.getInstance();