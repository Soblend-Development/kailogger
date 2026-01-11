
import * as fs from 'fs';
import * as path from 'path';

export class KaiSound {
    private static soundsDir: string | null = null;

    static setSoundsDir(dir: string): void {
        this.soundsDir = dir;
    }

    private static getSoundPath(filename: string): string | null {
        // 1. Explicitly set directory
        if (this.soundsDir) {
            const p = path.join(this.soundsDir, filename);
            if (fs.existsSync(p)) return p;
        }

        // 2. Local src/sounds (Development)
        const srcPath = path.join(__dirname, '../../src/sounds', filename);
        if (fs.existsSync(srcPath)) return srcPath;

        // 3. Dist sounds (Production/Installed)
        // __dirname is .../dist/features
        const distPath = path.join(__dirname, '../sounds', filename);
        if (fs.existsSync(distPath)) return distPath;

        // 4. Node modules fallback (if imported deeply)
        try {
            const pkgPath = require.resolve('kailogger/package.json');
            const pkgDir = path.dirname(pkgPath);
            const enrolledPath = path.join(pkgDir, 'dist/sounds', filename);
            if(fs.existsSync(enrolledPath)) return enrolledPath;
        } catch (e) {
            // ignore
        }

        return null;
    }

    private static async playFile(filename: string): Promise<void> {
        const filepath = this.getSoundPath(filename);
    
        if (!filepath) {
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
        await this.playFile('success.wav');
    }

    static async error(): Promise<void> {
        await this.playFile('error.wav');
    }

    static async warning(): Promise<void> {
        await this.playFile('warning.wav');
    }

    static async notification(): Promise<void> {
        await this.playFile('notification.wav');
    }

    static async play(filename: string): Promise<void> {
        await this.playFile(filename);
    }
}