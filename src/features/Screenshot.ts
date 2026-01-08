import * as fs from 'fs';
import * as path from 'path';
import { stripAnsi } from '../utils/stripAnsi';

export class KaiScreenshot {
    private static buffer: string[] = [];
    private static isRecording: boolean = false;
    static startCapture(): void {
        this.buffer = [];
        this.isRecording = true;
        const originalLog = console.log;
        console.log = (...args: any[]) => {
            if (this.isRecording) {
                const line = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                this.buffer.push(line);
            }
            originalLog.apply(console, args);
        };
    }
    static stopCapture(): string[] {
        this.isRecording = false;
        return [...this.buffer];
    }
    static save(filename: string): void {
        const dir = path.dirname(filename);
        if (dir && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const cleanLines = this.buffer.map(line => stripAnsi(line));
        const content = cleanLines.join('\n');
        fs.writeFileSync(filename, content);
    }
    static saveHtml(filename: string): void {
        const dir = path.dirname(filename);
        if (dir && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>KaiLogger Screenshot</title>
    <style>
        body {
            background: #1a1a2e;
            color: #eee;
            font-family: 'Consolas', 'Monaco', monospace;
            padding: 20px;
            font-size: 14px;
            line-height: 1.5;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <pre>${this.buffer.map(line => stripAnsi(line)).join('\n')}</pre>
</body>
</html>`;
        fs.writeFileSync(filename, htmlContent);
    }
    static getBuffer(): string[] {
        return [...this.buffer];
    }
    static clear(): void {
        this.buffer = [];
    }
}