import chalk from 'chalk';

export class KaiJson {
    static print(obj: any, theme: any) {
        const jsonStr = JSON.stringify(obj, null, 2);
        const colored = jsonStr
            .replace(/"([^"]+)":/g, (match, key) => {
                return chalk.hex(theme.info[0])(`"${key}"`) + ':';
            })
            .replace(/: "([^"]*)"/g, (match, val) => {
                return ': ' + chalk.hex(theme.success[1])(`"${val}"`);
            })
            .replace(/: (\d+\.?\d*)/g, (match, num) => {
                return ': ' + chalk.hex(theme.warning[0])(num);
            })
            .replace(/: (true|false)/g, (match, bool) => {
                return ': ' + chalk.hex(theme.error[0])(bool);
            })
            .replace(/: (null)/g, (match, n) => {
                return ': ' + chalk.hex(theme.dim)(n);
            });

        console.log(colored);
    }
}