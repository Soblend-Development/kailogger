import chalk from 'chalk';
import { paint } from '../styles/gradients';

export class KaiTable {
    static print(data: any[], theme: any) {
        if (data.length === 0) return;
        const keys = Object.keys(data[0]);
        const colWidths = keys.map(key => {
            const maxValLen = Math.max(...data.map(row => String(row[key]).length));
            return Math.max(key.length, maxValLen) + 2;
        });
        const createRow = (rowItems: string[], isHeader = false) => {
            return rowItems.map((item, i) => {
                const cell = item.padEnd(colWidths[i]);
                return isHeader 
                    ? paint.apply(cell, theme.info)
                    : cell;
            }).join(' │ ');
        };
        const separator = colWidths.map(w => '─'.repeat(w)).join('─┼─');
        const dimColor = chalk.hex(theme.dim);
        console.log(dimColor(separator));
        console.log(createRow(keys, true));
        console.log(dimColor(separator));
        data.forEach(row => {
            const values = keys.map(k => String(row[k]));
            console.log(createRow(values));
        });
        console.log(dimColor(separator));
    }
}