import * as fs from 'fs';
import * as path from 'path';
import { LogLevel, Transport } from '../types';
import { stripAnsi } from '../utils/stripAnsi';

export interface FileTransportOptions {
    filename: string;
    maxSize?: number; 
    maxFiles?: number; 
}
export class FileTransport implements Transport {
    name = 'file';
    private filename: string;
    private maxSize: number;
    private maxFiles: number;
    constructor(options: FileTransportOptions) {
        this.filename = options.filename;
        this.maxSize = options.maxSize || 10 * 1024 * 1024; 
        this.maxFiles = options.maxFiles || 5;
        const dir = path.dirname(this.filename);
        if (dir && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    private getTimestamp(): string {
        return new Date().toISOString();
    }
    private rotate(): void {
        try {
            const stats = fs.statSync(this.filename);
            if (stats.size >= this.maxSize) {
                for (let i = this.maxFiles - 1; i >= 1; i--) {
                    const oldFile = `${this.filename}.${i}`;
                    const newFile = `${this.filename}.${i + 1}`;
                    if (fs.existsSync(oldFile)) {
                        if (i === this.maxFiles - 1) {
                            fs.unlinkSync(oldFile);
                        } else {
                            fs.renameSync(oldFile, newFile);
                        }
                    }
                }
                fs.renameSync(this.filename, `${this.filename}.1`);
            }
        } catch (e) {
            // File doesn't exist yet, that's fine
        }
    }
    log(level: LogLevel, message: string, meta?: any): void {
        this.rotate();
        const cleanMessage = stripAnsi(message);
        const logLine = `${this.getTimestamp()} [${level.toUpperCase()}] ${cleanMessage}\n`;
        fs.appendFileSync(this.filename, logLine);
    }
}