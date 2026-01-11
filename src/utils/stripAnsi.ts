
import { KaiChroma } from '../styles/KaiChroma';

export function stripAnsi(str: string): string {
    return KaiChroma.strip(str);
}
