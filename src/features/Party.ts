import { KaiChroma } from '../styles/KaiChroma';
import * as readline from 'readline';

interface Particle {
    x: number;
    y: number;
    char: string;
    color: string;
    speedY: number;
    speedX: number;
}
export class KaiParty {
    private static isRunning = false;
    private static particles: Particle[] = [];
    private static height = 15;
    private static width = process.stdout.columns || 80;
    private static intervalId: NodeJS.Timeout | null = null;
    private static readonly SHAPES = ['█', '▓', '▒', '░', '●', '★', '♦', '■', '▲', '▼'];
    private static readonly COLORS = [
        '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', 
        '#FFA500', '#9400D3', '#FF1493', '#32CD32'
    ];
    static celebrate(duration: number = 3000): Promise<void> {
        if (this.isRunning) return Promise.resolve();
        this.isRunning = true;
        this.width = process.stdout.columns || 80;
        process.stdout.write('\x1B[?25l');
        this.createParticles(50);
        for (let i = 0; i < this.height; i++) {
            process.stdout.write('\n');
        }
        let elapsed = 0;
        const frameRate = 50; 
        return new Promise((resolve) => {
            this.intervalId = setInterval(() => {
                this.update();
                this.render();
                elapsed += frameRate;
                if (elapsed < duration - 1000 && Math.random() > 0.7) {
                    this.createParticles(5);
                }
                if (elapsed >= duration) {
                    this.stop();
                    resolve();
                }
            }, frameRate);
        });
    }
    private static createParticles(count: number) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.floor(Math.random() * this.width),
                y: 0,
                char: this.SHAPES[Math.floor(Math.random() * this.SHAPES.length)],
                color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
                speedY: Math.random() * 0.5 + 0.2, 
                speedX: (Math.random() - 0.5) * 2 
            });
        }
    }
    private static update() {
        this.particles = this.particles.filter(p => p.y < this.height);
        for (const p of this.particles) {
            p.y += p.speedY;
            p.x += Math.sin(p.y * 0.5) + p.speedX; 
            if (p.x < 0) p.x = this.width + p.x;
            if (p.x >= this.width) p.x = p.x - this.width;
        }
    }
    private static render() {
        readline.moveCursor(process.stdout, 0, -this.height);
        const lines: string[] = Array(this.height).fill('');
        const grid: { char: string, color: string }[][] = Array(this.height).fill(null).map(() => 
            Array(this.width).fill({ char: ' ', color: '' })
        );
        for (const p of this.particles) {
            const py = Math.floor(p.y);
            const px = Math.floor(p.x);
            if (py >= 0 && py < this.height && px >= 0 && px < this.width) {
                grid[py][px] = { char: p.char, color: p.color };
            }
        }
        for (let y = 0; y < this.height; y++) {
            let lineStr = '';
            for (let x = 0; x < this.width; x++) {
                const cell = grid[y][x];
                if (cell.char !== ' ') {
                    lineStr += KaiChroma.hex(cell.color, cell.char);
                } else {
                    lineStr += ' ';
                }
            }
            readline.clearLine(process.stdout, 0); 
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(lineStr + '\n');
        }
    }
    private static stop() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
        this.particles = [];
        this.isRunning = false;
        process.stdout.write('\x1B[?25h');
    }
}
