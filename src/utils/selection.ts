import * as readline from 'readline';
import chalk from 'chalk';
import { paint } from '../styles/gradients';

export class KaiSelection {
    static async select(question: string, options: string[], theme: any): Promise<string> {
        return new Promise((resolve) => {
            let selectedIndex = 0;
            const stdin = process.stdin;
            const stdout = process.stdout;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding('utf8');
            const render = () => {
                readline.moveCursor(stdout, 0, -(options.length + 1));
                readline.clearScreenDown(stdout);
                const q = paint.apply(`? ${question} `, theme.info);
                console.log(q);
                options.forEach((opt, i) => {
                    if (i === selectedIndex) {
                        const pointer = paint.apply('>', theme.success);
                        const text = paint.apply(opt, theme.success);
                        console.log(` ${pointer} ${text}`);
                    } else {
                        console.log(chalk.gray(`   ${opt}`));
                    }
                });
            };
            console.log('\n'.repeat(options.length));
            render();
            const handler = (key: string) => {
                if (key === '\u0003') { 
                    process.exit();
                }
                if (key === '\u001b[A') { 
                    selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : options.length - 1;
                    render();
                } else if (key === '\u001b[B') {
                    selectedIndex = (selectedIndex < options.length - 1) ? selectedIndex + 1 : 0;
                    render();
                } else if (key === '\r') {
                    stdin.removeListener('data', handler);
                    stdin.setRawMode(false);
                    stdin.pause();
                    readline.moveCursor(stdout, 0, -(options.length + 1));
                    readline.clearScreenDown(stdout);
                    console.log(`${paint.apply(`✔ ${question}`, theme.success)} ${chalk.bold(options[selectedIndex])}`);
                    resolve(options[selectedIndex]);
                }
            };

            stdin.on('data', handler);
        });
    }
    static async multiselect(question: string, options: string[], theme: any): Promise<string[]> {
        return new Promise((resolve) => {
            let selectedIndex = 0;
            const selected = new Set<number>();
            const stdin = process.stdin;
            const stdout = process.stdout;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding('utf8');
            const render = () => {
                readline.moveCursor(stdout, 0, -(options.length + 1));
                readline.clearScreenDown(stdout);
                const q = paint.apply(`? ${question} `, theme.info);
                console.log(`${q} ${chalk.dim('(Space to select, Enter to confirm)')}`);
                options.forEach((opt, i) => {
                    const isSelected = selected.has(i);
                    const isHovered = i === selectedIndex;
                    let prefix = isSelected ? paint.apply('◉', theme.success) : '◯';
                    let text = opt;
                    if (isHovered) {
                         prefix = paint.apply('>', theme.info) + ' ' + prefix;
                         text = paint.apply(text, theme.info);
                    } else {
                        prefix = '  ' + prefix;
                        text = chalk.gray(text);
                    }
                    
                    console.log(`${prefix} ${text}`);
                });
            };
            console.log('\n'.repeat(options.length));
            render();
            const handler = (key: string) => {
                if (key === '\u0003') process.exit();
                if (key === '\u001b[A') { 
                    selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : options.length - 1;
                    render();
                } else if (key === '\u001b[B') {
                    selectedIndex = (selectedIndex < options.length - 1) ? selectedIndex + 1 : 0;
                    render();
                } else if (key === ' ') { 
                    if (selected.has(selectedIndex)) selected.delete(selectedIndex);
                    else selected.add(selectedIndex);
                    render();
                } else if (key === '\r') { 
                    stdin.removeListener('data', handler);
                    stdin.setRawMode(false);
                    stdin.pause();
                    readline.moveCursor(stdout, 0, -(options.length + 1));
                    readline.clearScreenDown(stdout);
                    const result = options.filter((_, i) => selected.has(i));
                    console.log(`${paint.apply(`✔ ${question}`, theme.success)} ${chalk.bold(result.join(', '))}`);
                    resolve(result);
                }
            };
            stdin.on('data', handler);
        });
    }
}