import process from 'process';
import chalk from 'chalk';

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
export class KaiSpinner {
    private timer: NodeJS.Timeout | null = null;
    private index = 0;
    private text = '';
    private colorFn = chalk.cyan;
    start(text: string, colorHex: string = '#00FFFF') {
        this.stop();
        this.text = text;
        this.colorFn = chalk.hex(colorHex);
        process.stdout.write('\x1B[?25l');
        this.timer = setInterval(() => {
            const frame = frames[this.index = ++this.index % frames.length];
            process.stdout.write(`\r${this.colorFn(frame)} ${this.text}`);
        }, 80);
    }
    stop(symbol: string = '✔', endText?: string, colorHex?: string) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            process.stdout.write('\r\x1B[K');
            process.stdout.write('\x1B[?25h');
            if (endText) {
                const finalColor = colorHex ? chalk.hex(colorHex) : this.colorFn;
                console.log(`${finalColor(symbol)} ${endText}`);
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