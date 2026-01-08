import gradient from 'gradient-string';
import { palettes, ThemeName } from '../styles/palettes';

export class KaiProgress {
    private total: number;
    private current: number;
    private width: number;
    private theme: ThemeName;
    constructor(total: number, width: number = 40, theme: ThemeName = 'zen') {
        this.total = total;
        this.current = 0;
        this.width = width;
        this.theme = theme;
    }
    public update(current: number) {
        this.current = current;
        this.render();
    }
    public increment(amount: number = 1) {
        this.current = Math.min(this.total, this.current + amount);
        this.render();
    }
    private render() {
        const percentage = Math.min(1, this.current / this.total);
        const filledWidth = Math.round(this.width * percentage);
        const emptyWidth = this.width - filledWidth; 
        const filledChar = '█';
        const emptyChar = '░';
        const filled = filledChar.repeat(filledWidth);
        const empty = emptyChar.repeat(emptyWidth);
        const palette = palettes[this.theme] as any;
        const colors = palette.info;
        const dimColor = palette.dim;
        const grad = gradient(colors);
        const bar = grad(filled) + gradient([dimColor, dimColor])(empty);
        const percentText = Math.round(percentage * 100).toString().padStart(3);
        process.stdout.write(`\r${bar} ${percentText}%`);
        if (this.current >= this.total) {
            process.stdout.write('\n');
        }
    }
}