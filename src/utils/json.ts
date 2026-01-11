
import { KaiChroma } from '../styles/KaiChroma';

export class KaiJson {
    static print(obj: any, theme: any) {
        const jsonStr = JSON.stringify(obj, null, 2);
        
        // Manual colorization for full control using KaiChroma
        const colored = jsonStr
            // Strings (keys)
            .replace(/"([^"]+)":/g, (match, key) => {
                return KaiChroma.hex(theme.info[0], `"${key}"`) + ':';
            })
            // String values
            .replace(/: "([^"]*)"/g, (match, val) => {
                return ': ' + KaiChroma.hex(theme.success[1], `"${val}"`);
            })
            // Numbers
            .replace(/: (\d+\.?\d*)/g, (match, num) => {
                return ': ' + KaiChroma.hex(theme.warning[0], num);
            })
            // Booleans
            .replace(/: (true|false)/g, (match, bool) => {
                return ': ' + KaiChroma.hex(theme.error[0], bool);
            })
            // Null
            .replace(/: (null)/g, (match, n) => {
                return ': ' + KaiChroma.hex(theme.dim, n);
            });

        console.log(colored);
    }
}