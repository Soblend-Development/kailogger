import * as readline from 'readline';
import { paint } from '../styles/gradients';

export class KaiPrompt {
    static ask(question: string, theme: any): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const q = paint.apply(`? ${question} `, theme.info);
        return new Promise(resolve => {
            rl.question(q, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }
    static confirm(question: string, theme: any): Promise<boolean> {
        return this.ask(`${question} (y/n)`, theme).then(ans => {
            return ans.toLowerCase().startsWith('y');
        });
    }
}