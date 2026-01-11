
import * as stackTrace from 'stack-trace';
import * as fs from 'fs';
import { KaiChroma } from '../styles/KaiChroma';
import { paint } from '../styles/palettes';

export class PrettyError {
    static handle(error: Error, theme: any) {
        const trace = stackTrace.parse(error);
        
        console.log('');
        console.log(paint.apply(` 💥 ${error.name} `, theme.error));
        console.log(KaiChroma.bold(error.message));
        
        // Find the first relevant frame (not node internal)
        const frame = trace.find(t => {
            const file = t.getFileName();
            return file && !file.includes('node_modules') && !file.startsWith('node:');
        });

        if (frame) {
            const fileName = frame.getFileName();
            const lineNumber = frame.getLineNumber();
            
            console.log(KaiChroma.hex('#666666', `at ${fileName}:${lineNumber}`));
            console.log(KaiChroma.hex('#666666', '─'.repeat(50)));

            try {
                const content = fs.readFileSync(fileName, 'utf-8');
                const lines = content.split('\n');
                const start = Math.max(0, lineNumber - 3);
                const end = Math.min(lines.length, lineNumber + 2);

                for (let i = start; i < end; i++) {
                    const isErrorLine = i + 1 === lineNumber;
                    const lineNumStr = (i + 1).toString().padEnd(4);
                    
                    if (isErrorLine) {
                        const lineContent = KaiChroma.bold(lines[i]);
                        console.log(paint.apply(` > ${lineNumStr} | ${lineContent}`, theme.error));
                    } else {
                        console.log(KaiChroma.hex('#888888', `   ${lineNumStr} | ${lines[i]}`));
                    }
                }
            } catch (e) {
                // Fallback if file cannot be read
                console.log(KaiChroma.dim('   (Source code unavailable)'));
            }
            console.log(KaiChroma.hex('#666666', '─'.repeat(50)));
        }

        // Show simplified stack
        console.log('');
        console.log(KaiChroma.dim('Stack Trace:'));
        trace.forEach(t => {
            const fn = t.getFunctionName() || '<anonymous>';
            const file = t.getFileName();
            const line = t.getLineNumber();
            if (file && !file.includes('node_modules')) {
                 console.log(KaiChroma.dim(`  at ${fn} (${file}:${line})`));
            }
        });
        console.log('');
    }
}