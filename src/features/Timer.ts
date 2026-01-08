import chalk from 'chalk';
import { paint } from '../styles/gradients';

export class KaiTimer {
    private timers: Map<string, number> = new Map();
    time(label: string): void {
        this.timers.set(label, performance.now());
    }
    timeEnd(label: string, theme: any): number | null {
        const start = this.timers.get(label);
        if (!start) {
            console.log(chalk.yellow(`⚠ Timer "${label}" does not exist`));
            return null;
        }
        const duration = performance.now() - start;
        this.timers.delete(label);
        const ms = duration.toFixed(2);
        let color = theme.success;
        let emoji = '⚡';

        if (duration > 1000) {
            color = theme.warning;
            emoji = '🐢';
        }
        if (duration > 5000) {
            color = theme.error;
            emoji = '🔥';
        }
        console.log(paint.apply(` ⏱ ${label}: ${ms}ms ${emoji} `, color));
        return duration;
    }
    clear(): void {
        this.timers.clear();
    }
}