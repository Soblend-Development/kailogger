
import CryptoJS from 'crypto-js';
import { KaiChroma } from '../styles/KaiChroma';

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
        console.log(KaiChroma.hex('#FF00FF', '🔐 [ENCRYPTED] ') + KaiChroma.dim(encrypted));
    }

    static printDecrypted(encrypted: string, key?: string): void {
        try {
            const decrypted = this.decrypt(encrypted, key);
            console.log(KaiChroma.hex('#00FF00', '🔓 [DECRYPTED] ') + decrypted);
        } catch (e) {
            console.log(KaiChroma.hex('#FF0000', '❌ [DECRYPT FAILED] Invalid key or corrupted data'));
        }
    }

    static mask(message: string, showLast: number = 4): string {
        if (message.length <= showLast) return '*'.repeat(message.length);
        const masked = '*'.repeat(message.length - showLast);
        const visible = message.slice(-showLast);
        return masked + visible;
    }

    static printMasked(label: string, value: string, showLast: number = 4): void {
        console.log(KaiChroma.hex('#FFFF00', `🔒 ${label}: `) + KaiChroma.dim(this.mask(value, showLast)));
    }
}