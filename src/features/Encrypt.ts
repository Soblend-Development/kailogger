import CryptoJS from 'crypto-js';
import chalk from 'chalk';

export class KaiEncrypt {
    private static defaultKey: string = 'kailogger-secret-key';
    static setDefaultKey(key: string): void {
        this.defaultKey = key;
    }
    static encrypt(message: string, key?: string): string {
        const secretKey = key || this.defaultKey;
        return CryptoJS.AES.encrypt(message, secretKey).toString();
    }
    static decrypt(encrypted: string, key?: string): string {
        const secretKey = key || this.defaultKey;
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    static printEncrypted(message: string, key?: string): void {
        const encrypted = this.encrypt(message, key);
        console.log(chalk.magenta('🔐 [ENCRYPTED] ') + chalk.dim(encrypted));
    }
    static printDecrypted(encrypted: string, key?: string): void {
        try {
            const decrypted = this.decrypt(encrypted, key);
            console.log(chalk.green('🔓 [DECRYPTED] ') + decrypted);
        } catch (e) {
            console.log(chalk.red('❌ [DECRYPT FAILED] Invalid key or corrupted data'));
        }
    }
    static mask(message: string, showLast: number = 4): string {
        if (message.length <= showLast) return '*'.repeat(message.length);
        const masked = '*'.repeat(message.length - showLast);
        const visible = message.slice(-showLast);
        return masked + visible;
    }
    static printMasked(label: string, value: string, showLast: number = 4): void {
        console.log(chalk.yellow(`🔒 ${label}: `) + chalk.dim(this.mask(value, showLast)));
    }
}