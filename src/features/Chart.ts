import chalk from 'chalk';
import { paint } from '../styles/gradients';

interface ChartItem {
    label: string;
    value: number;
    color?: string;
}
export class KaiChart {
    static bar(data: ChartItem[], theme: any, options?: { width?: number; showValues?: boolean }) {
        const width = options?.width || 30;
        const showValues = options?.showValues !== false;
        const maxValue = Math.max(...data.map(d => d.value));
        const maxLabelLength = Math.max(...data.map(d => d.label.length));
        console.log('');
        data.forEach((item, index) => {
            const percentage = item.value / maxValue;
            const filledWidth = Math.round(width * percentage);
            const emptyWidth = width - filledWidth;
            const filled = '█'.repeat(filledWidth);
            const empty = '░'.repeat(emptyWidth);
            const colorKeys = ['success', 'info', 'warning', 'error', 'debug'];
            const colorKey = colorKeys[index % colorKeys.length];
            const colors = theme[colorKey];
            const label = item.label.padEnd(maxLabelLength);
            const bar = paint.apply(filled, colors) + chalk.gray(empty);
            const value = showValues ? ` ${item.value}` : '';
            console.log(`${chalk.bold(label)} ${bar}${chalk.dim(value)}`);
        });
        console.log('');
    }
    static horizontal(data: ChartItem[], theme: any) {
        this.bar(data, theme);
    }
    static sparkline(values: number[], theme: any) {
        const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;
        const line = values.map(v => {
            const index = Math.floor(((v - min) / range) * (chars.length - 1));
            return chars[index];
        }).join('');
        console.log(paint.apply(line, theme.info));
    }
    static gauge(value: number, max: number, theme: any, label?: string) {
        const percentage = Math.min(1, value / max);
        const width = 20;
        const filledWidth = Math.round(width * percentage);
        const emptyWidth = width - filledWidth;
        const filled = '█'.repeat(filledWidth);
        const empty = '░'.repeat(emptyWidth);
        let colors = theme.success;
        if (percentage > 0.7) colors = theme.warning;
        if (percentage > 0.9) colors = theme.error;
        const bar = paint.apply(filled, colors) + chalk.gray(empty);
        const percentText = Math.round(percentage * 100) + '%';
        const labelText = label ? `${label}: ` : '';
        console.log(`${labelText}[${bar}] ${percentText}`);
    }
}