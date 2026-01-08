import chalk from 'chalk';
import * as stackTrace from 'stack-trace';
import * as fs from 'fs';
import { paint } from '../styles/gradients';

export class PrettyError {
    static handle(error: Error, theme: any) {
        const trace = stackTrace.parse(error);
        console.log('');
        console.log(paint.apply(` 💥 ${error.name} `, theme.error));
        console.log(chalk.bold(error.message));
        console.log('');
        const frame = trace.find(t => {
            const file = t.getFileName();
            return file && !file.includes('node_modules') && !file.startsWith('node:');
        });
        if (frame) {
            const fileName = frame.getFileName();
            const lineNumber = frame.getLineNumber();
            console.log(chalk.gray(`at ${fileName}:${lineNumber}`));
            console.log(chalk.gray('─'.repeat(50)));
            try {
                const content = fs.readFileSync(fileName, 'utf-8');
                const lines = content.split('\n');
                const start = Math.max(0, lineNumber - 3);
                const end = Math.min(lines.length, lineNumber + 2);
                for (let i = start; i < end; i++) {
                    const isErrorLine = i + 1 === lineNumber;
                    const lineNumStr = (i + 1).toString().padEnd(4);
                    if (isErrorLine) {
                        const lineContent = chalk.bold(lines[i]);
                        console.log(paint.apply(` > ${lineNumStr} | ${lineContent}`, theme.error));
                    } else {
                        console.log(chalk.gray(`   ${lineNumStr} | ${lines[i]}`));
                    }
                }
            } catch (e) {
                console.log(chalk.dim('   (Source code unavailable)'));
            }
            console.log(chalk.gray('─'.repeat(50)));
        }
        console.log('');
        console.log(chalk.dim('Stack Trace:'));
        trace.forEach(t => {
            const file = t.getFileName();
            if (file && !file.includes('node_modules') && !file.startsWith('node:')) {
                console.log(chalk.dim(`   at ${t.getFunctionName() || '<anonymous>'} (${file}:${t.getLineNumber()})`));
            }
        });
        console.log('');
    }
}