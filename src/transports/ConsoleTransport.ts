
import { LogLevel, Transport } from '../types';
import { paint } from '../styles/palettes';
import { palettes, ThemeName } from '../styles/palettes';

export class ConsoleTransport implements Transport {
    name = 'console';
    private theme: ThemeName;
    constructor(theme: ThemeName = 'zen') {
        this.theme = theme;
    }
    setTheme(theme: ThemeName) {
        this.theme = theme;
        paint.setTheme(theme);
    }
    log(level: LogLevel, message: string, meta?: any): void {
        console.log(message, ...(meta?.args || []));
    }
}