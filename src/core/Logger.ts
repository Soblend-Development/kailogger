import * as fs from 'fs';
import { paint, palettes, ThemeName } from '../styles/palettes';
import { KaiChroma } from '../styles/KaiChroma';
import { KaiSpinner } from '../utils/spinner';
import { KaiProgress } from '../utils/progress';
import { KaiTable } from '../utils/table';
import { KaiPrompt } from '../utils/prompt';
import { KaiSelection } from '../utils/selection';
import { KaiJson } from '../utils/json';
import { PrettyError } from '../utils/prettyError';
import { stripAnsi } from '../utils/stripAnsi';
import { config } from './Config';
import { ScopedLogger } from './Scope';
import { KaiTimer } from '../features/Timer';
import { KaiTree } from '../features/Tree';
import { KaiDiff } from '../features/Diff';
import { KaiChart } from '../features/Chart';
import { KaiNotify } from '../features/Notify';
import { KaiScreenshot } from '../features/Screenshot';
import { KaiEncrypt } from '../features/Encrypt';
import { KaiSound } from '../features/Sound';
import { KaiUpdateNotifier } from '../features/UpdateNotifier';
import { LogLevel, LOG_LEVEL_PRIORITY, Transport, KaiConfig } from '../types';
import { FileTransport, FileTransportOptions } from '../transports/FileTransport';
import { WebhookTransport, WebhookTransportOptions } from '../transports/WebhookTransport';

interface LoggerOptions {
    theme?: ThemeName;
    level?: LogLevel;
    logFile?: string;
    silent?: boolean;
    timestamp?: 'ISO' | 'locale' | 'relative' | 'none';
}
export class KaiLogger {
    private spinner = new KaiSpinner();
    private timer = new KaiTimer();
    private logFilePath?: string;
    private buffer: string[] = [];
    private startTime: number = Date.now();
    public theme: ThemeName;
    public level: LogLevel;
    public silent: boolean;
    public timestampFormat: 'ISO' | 'locale' | 'relative' | 'none';
    constructor(options: LoggerOptions | ThemeName = 'zen') {
        if (typeof options === 'string') {
            this.theme = options;
            this.level = 'debug';
            this.silent = false;
            this.timestampFormat = 'locale';
        } else {
            this.theme = options.theme || 'zen';
            this.level = options.level || 'debug';
            this.logFilePath = options.logFile;
            this.silent = options.silent || false;
            this.timestampFormat = options.timestamp || 'locale';
        }
        paint.setTheme(this.theme);
    }
    public configure(options: Partial<LoggerOptions>): void {
        if (options.theme) this.setTheme(options.theme);
        if (options.level) this.level = options.level;
        if (options.logFile) this.logFilePath = options.logFile;
        if (options.silent !== undefined) this.silent = options.silent;
        if (options.timestamp) this.timestampFormat = options.timestamp;
    }
    public setTheme(theme: ThemeName): void {
        this.theme = theme;
        paint.setTheme(theme);
    }
    public setLevel(level: LogLevel): void {
        this.level = level;
    }
    public setSilent(silent: boolean): void {
        this.silent = silent;
    }
    public addFileTransport(options: FileTransportOptions): void {
        config.addTransport(new FileTransport(options));
    }
    public addWebhookTransport(options: WebhookTransportOptions): void {
        config.addTransport(new WebhookTransport(options));
    }
    public removeTransport(name: string): void {
        config.removeTransport(name);
    }
    public scope(name: string): ScopedLogger {
        return new ScopedLogger(this, name);
    }
    private getTime(): string {
        if (this.timestampFormat === 'none') return '';
        const now = new Date();
        switch (this.timestampFormat) {
            case 'ISO':
                return `[${now.toISOString()}]`;
            case 'relative':
                const elapsed = Date.now() - this.startTime;
                const seconds = (elapsed / 1000).toFixed(1);
                return `[+${seconds}s]`;
            case 'locale':
            default:
                return `[${now.toLocaleTimeString()}]`;
        }
    }
    private shouldLog(level: LogLevel): boolean {
        if (this.silent) return false;
        return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.level];
    }
    private logToFile(level: string, message: string): void {
        if (this.logFilePath) {
            const cleanMsg = stripAnsi(message);
            const logLine = `${this.getTime()} [${level.toUpperCase()}] ${cleanMsg}\n`;
            fs.appendFileSync(this.logFilePath, logLine);
        }
        const transports = config.get('transports') || [];
        transports.forEach(t => t.log(level as LogLevel, message));
    }
    private addToBuffer(level: string, message: string): void {
        this.buffer.push(`${this.getTime()} [${level.toUpperCase()}] ${message}`);
    }
    public getBuffer(): string[] {
        return [...this.buffer];
    }
    public clearBuffer(): void {
        this.buffer = [];
    }
    private print(level: LogLevel, label: string, message: string, ...args: any[]): void {
        if (!this.shouldLog(level)) {
            this.addToBuffer(level, message);
            return;
        }
        this.stopSpinner();
        const colors = (paint.colors as any)[level] as string[]; 
        const time = this.timestampFormat !== 'none' ? KaiChroma.hex('#666666', this.getTime()) + ' ' : '';
        const badge = paint.apply(` ${label.padEnd(7)} `, colors);
        const output = `${time}${badge} ${message}`;
        console.log(output, ...args);
        const fileMsg = [message, ...args.map(a => typeof a === 'object' ? JSON.stringify(a) : a)].join(' ');
        this.logToFile(level, fileMsg);
        this.addToBuffer(level, fileMsg);
    }
    public success(message: string, ...args: any[]): void {
        this.print('success', '✔ SUCCESS', message, ...args);
    }
    public error(message: string | Error, ...args: any[]): void {
        if (!this.shouldLog('error')) return;
        if (message instanceof Error) {
            this.stopSpinner();
            PrettyError.handle(message, paint.colors);
            this.logToFile('error', message.toString());
            this.addToBuffer('error', message.toString());
        } else {
            this.print('error', '✖ ERROR', message, ...args);
        }
    }
    public warning(message: string, ...args: any[]): void {
        this.print('warning', '⚠ WARN', message, ...args);
    }
    public info(message: string, ...args: any[]): void {
        this.print('info', 'ℹ INFO', message, ...args);
    }
    public debug(message: string, ...args: any[]): void {
        this.print('debug', '⚙ DEBUG', message, ...args);
    }
    public log(message: string): void {
        if (this.silent) return;
        this.stopSpinner();
        const time = this.timestampFormat !== 'none' ? KaiChroma.hex('#666666', this.getTime()) + ' ' : '';
        console.log(`${time}${message}`);
        this.logToFile('log', message);
    }
    public custom(badge: string, color: string, message: string, ...args: any[]): void {
        if (this.silent) return;
        this.stopSpinner();
        const time = this.timestampFormat !== 'none' ? KaiChroma.hex('#666666', this.getTime()) + ' ' : '';
        const styledBadge = KaiChroma.bgHex(color, ` ${badge.toUpperCase().padEnd(7)} `);
        console.log(`${time}${styledBadge} ${message}`, ...args);
        this.logToFile(badge, message);
    }
    public box(title: string, message: string): void {
        if (this.silent) return;
        this.stopSpinner();
        const width = Math.max(message.length, title.length) + 4;
        const border = paint.apply('─'.repeat(width), paint.colors.info);
        const topLeft = paint.apply('╭', paint.colors.info);
        const topRight = paint.apply('╮', paint.colors.info);
        const bottomLeft = paint.apply('╰', paint.colors.info);
        const bottomRight = paint.apply('╯', paint.colors.info);
        const side = paint.apply('│', paint.colors.info);
        console.log(`${topLeft}${border}${topRight}`);
        console.log(`${side} ${paint.apply(title.padEnd(width - 2), paint.colors.success)} ${side}`);
        console.log(`${side}${paint.apply('─'.repeat(width), paint.colors.debug)}${side}`);
        console.log(`${side} ${message.padEnd(width - 2)} ${side}`);
        console.log(`${bottomLeft}${border}${bottomRight}`);
        this.logToFile('box', `${title}: ${message}`);
    }
    public await(message: string): void {
        if (this.silent) return;
        this.spinner.start(message, paint.colors.info[0]);
    }
    public stop(message?: string): void {
        this.spinner.stop('✔', message, paint.colors.success[1]);
        if (message) this.logToFile('stop', message);
    }
    private stopSpinner(): void {
        this.spinner.stop();
    }
    public createProgress(total: number, width?: number): KaiProgress {
        return new KaiProgress(total, width, this.theme);
    }
    public table(data: any[]): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiTable.print(data, paint.colors);
        this.logToFile('table', JSON.stringify(data));
    }
    public json(data: any): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiJson.print(data, paint.colors);
        this.logToFile('json', JSON.stringify(data));
    }
    public tree(data: any): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiTree.print(data, paint.colors);
        this.logToFile('tree', JSON.stringify(data));
    }
    public diff(before: any, after: any): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiDiff.print(before, after, paint.colors);
        this.logToFile('diff', JSON.stringify({ before, after }));
    }
    public time(label: string): void {
        this.timer.time(label);
    }
    public timeEnd(label: string): number | null {
        if (this.silent) return null;
        return this.timer.timeEnd(label, paint.colors);
    }
    public async ask(question: string): Promise<string> {
        this.stopSpinner();
        const answer = await KaiPrompt.ask(question, paint.colors);
        this.logToFile('ask', `${question} -> ${answer}`);
        return answer;
    }
    public async confirm(question: string): Promise<boolean> {
        this.stopSpinner();
        const answer = await KaiPrompt.confirm(question, paint.colors);
        this.logToFile('confirm', `${question} -> ${answer}`);
        return answer;
    }
    public async select(question: string, options: string[]): Promise<string> {
        this.stopSpinner();
        const answer = await KaiSelection.select(question, options, paint.colors);
        this.logToFile('select', `${question} -> ${answer}`);
        return answer;
    }
    public async multiselect(question: string, options: string[]): Promise<string[]> {
        this.stopSpinner();
        const answer = await KaiSelection.multiselect(question, options, paint.colors);
        this.logToFile('multiselect', `${question} -> ${answer.join(', ')}`);
        return answer;
    }
    public chart(data: { label: string; value: number }[], options?: { width?: number; showValues?: boolean }): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiChart.bar(data, paint.colors, options);
    }
    public sparkline(values: number[]): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiChart.sparkline(values, paint.colors);
    }
    public gauge(value: number, max: number, label?: string): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiChart.gauge(value, max, paint.colors, label);
    }
    public notify(message: string, title?: string): void {
        KaiNotify.send({ message, title });
    }
    public notifySuccess(message: string): void {
        KaiNotify.success(message);
    }
    public notifyError(message: string): void {
        KaiNotify.error(message);
    }
    public startCapture(): void {
        KaiScreenshot.startCapture();
    }
    public stopCapture(): string[] {
        return KaiScreenshot.stopCapture();
    }
    public saveScreenshot(filename: string): void {
        KaiScreenshot.save(filename);
    }
    public saveScreenshotHtml(filename: string): void {
        KaiScreenshot.saveHtml(filename);
    }
    public setEncryptionKey(key: string): void {
        KaiEncrypt.setDefaultKey(key);
    }
    public encrypted(message: string, key?: string): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiEncrypt.printEncrypted(message, key);
    }
    public decrypted(encryptedMessage: string, key?: string): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiEncrypt.printDecrypted(encryptedMessage, key);
    }
    public masked(label: string, value: string, showLast?: number): void {
        if (this.silent) return;
        this.stopSpinner();
        KaiEncrypt.printMasked(label, value, showLast);
    }
    public setSoundsDir(dir: string): void {
        KaiSound.setSoundsDir(dir);
    }
    public beep(): void {
        KaiSound.beep();
    }
    public async soundSuccess(): Promise<void> {
        await KaiSound.success();
    }
    public async soundError(): Promise<void> {
        await KaiSound.error();
    }
    public async soundWarning(): Promise<void> {
        await KaiSound.warning();
    }
    public async soundNotification(): Promise<void> {
        await KaiSound.notification();
    }
    public async playSound(filename: string): Promise<void> {
        await KaiSound.play(filename);
    }
    public static checkUpdate(pkg: any): void {
        KaiUpdateNotifier.check(pkg);
    }
}

export const kai = new KaiLogger();