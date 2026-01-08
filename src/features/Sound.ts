import * as path from 'path';
import * as fs from 'fs';

export class KaiSound {
    private static soundsDir: string = '';
    static setSoundsDir(dir: string): void {
        this.soundsDir = dir;
    }
    private static async playFile(filename: string): Promise<void> {
        const filepath = this.soundsDir ? path.join(this.soundsDir, filename) : filename;
        if (!fs.existsSync(filepath)) {
            this.beep();
            return;
        }
        const { exec } = await import('child_process');
        const platform = process.platform;
        return new Promise((resolve) => {
            let command: string;
            if (platform === 'win32') {
                command = `powershell -c "(New-Object Media.SoundPlayer '${filepath}').PlaySync()"`;
            } else if (platform === 'darwin') {
                command = `afplay "${filepath}"`;
            } else {
                command = `aplay "${filepath}" 2>/dev/null || paplay "${filepath}" 2>/dev/null`;
            }
            exec(command, (error) => {
                resolve();
            });
        });
    }
    static beep(): void {
        process.stdout.write('\x07');
    }
    static async success(): Promise<void> {
        if (this.soundsDir && fs.existsSync(path.join(this.soundsDir, 'success.wav'))) {
            await this.playFile('success.wav');
        } else {
            this.beep();
        }
    }
    static async error(): Promise<void> {
        if (this.soundsDir && fs.existsSync(path.join(this.soundsDir, 'error.wav'))) {
            await this.playFile('error.wav');
        } else {
            this.beep();
            setTimeout(() => this.beep(), 200);
        }
    }
    static async warning(): Promise<void> {
        if (this.soundsDir && fs.existsSync(path.join(this.soundsDir, 'warning.wav'))) {
            await this.playFile('warning.wav');
        } else {
            this.beep();
        }
    }
    static async notification(): Promise<void> {
        if (this.soundsDir && fs.existsSync(path.join(this.soundsDir, 'notification.wav'))) {
            await this.playFile('notification.wav');
        } else {
            this.beep();
        }
    }
    static async play(filename: string): Promise<void> {
        await this.playFile(filename);
    }
}