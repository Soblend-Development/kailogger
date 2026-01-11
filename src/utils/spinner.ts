
import { KaiChroma } from '../styles/KaiChroma';

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export class KaiSpinner {
    private timer: NodeJS.Timeout | null = null;
    private index = 0;
    private text = '';
    private colorHex = '#00FFFF'; // Default cyan-ish

    start(text: string, colorHex: string = '#00FFFF') {
        this.stop();
        this.text = text;
        this.colorHex = colorHex;
        process.stdout.write('\x1B[?25l');
        this.timer = setInterval(() => {
            const frame = frames[this.index = ++this.index % frames.length];
            process.stdout.write(`\r${KaiChroma.hex(this.colorHex, frame)} ${this.text}`);
        }, 80);
    }

    stop(symbol: string = '✔', endText?: string, colorHex?: string) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            process.stdout.write('\r\x1B[K');
            process.stdout.write('\x1B[?25h');
            if (endText) {
                const finalColor = colorHex || this.colorHex;
                console.log(`${KaiChroma.hex(finalColor, symbol)} ${endText}`);
            }
        }
    }

    fail(text: string) {
        this.stop('✖', text, '#FF0000');
    }

    succeed(text: string) {
        this.stop('✔', text, '#00FF00');
    }
}