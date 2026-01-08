import notifier from 'node-notifier';
import * as path from 'path';

export interface NotificationOptions {
    title?: string;
    message: string;
    icon?: string;
    sound?: boolean;
    wait?: boolean;
}

export class KaiNotify {
    static send(options: NotificationOptions): void {
        const defaultIcon = path.join(__dirname, '../../src/icon/logo.png'); 
        let iconPath = options.icon || defaultIcon;
        if (__filename.includes('dist')) {
             iconPath = options.icon || path.join(__dirname, '../icon/logo.png');
        }
        notifier.notify({
            title: options.title || 'KaiLogger',
            message: options.message,
            icon: iconPath,
            sound: options.sound !== false,
            wait: options.wait || false
        });
    }
    static success(message: string): void {
        this.send({ title: '✅ Success', message, sound: true });
    }
    static error(message: string): void {
        this.send({ title: '❌ Error', message, sound: true });
    }
    static warning(message: string): void {
        this.send({ title: '⚠️ Warning', message, sound: true });
    }
    static info(message: string): void {
        this.send({ title: 'ℹ️ Info', message, sound: false });
    }
}