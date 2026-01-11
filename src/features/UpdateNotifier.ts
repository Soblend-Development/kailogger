import updateNotifier from 'update-notifier';
import { KaiChroma } from '../styles/KaiChroma';
import { paint } from '../styles/palettes';

export class KaiUpdateNotifier {
    static check(pkg: any): void {
        const notifier = updateNotifier({
            pkg,
            updateCheckInterval: 1000 * 60 * 60 * 12, 
            shouldNotifyInNpmScript: true
        });
        if (notifier.update) {
            this.show(notifier.update, pkg.name);
        }
    }
    private static show(update: any, packageName: string): void {
        const { latest, current, type } = update;
        if (current === latest) return;
        const borderGradient = paint.colors.info; 
        const titleColor = paint.colors.accent;
        const labelColor = paint.colors.text;
        const valueColor = paint.colors.success; 
        const oldColor = paint.colors.error; 
        const cmdColor = paint.colors.warning;
        const labelActual = 'Current »';
        const labelNueva = 'Latest »';
        const labelInstall = 'Command »';
        const cmd = `npm i ${packageName}@latest`;
        const maxLabelLen = Math.max(labelActual.length, labelNueva.length, labelInstall.length);
        const maxValLen = Math.max(current.length, latest.length, cmd.length);
        const line1Content = `${labelActual} ${current}`;
        const line2Content = `${labelNueva} ${latest}`;
        const line3Content = `${labelInstall} ${cmd}`;
        const contentWidth = Math.max(line1Content.length, line2Content.length, line3Content.length) + 4; 
        const title = `⌞${packageName.charAt(0).toUpperCase() + packageName.slice(1)}⌝`;
        const minWidth = title.length + 8; 
        const width = Math.max(contentWidth, minWidth, 35); 
        const tl = '┌';
        const tr = '⊱'; 
        const bl = '└';
        const br = '╯';
        const h = '─';
        const v = '│';
        const bullet = '›';
        const dashLen1 = 1; 
        const dashLen2 = width - (dashLen1 + 2 + title.length + 2); 
        const cBorder = (t: string) => paint.apply(t, borderGradient);
        const cTitle = (t: string) => KaiChroma.bold(paint.apply(t, [paint.colors.accent]));
        const topPart1 = cBorder(`${tl}${h} `);
        const topTitle = cTitle(title);
        const topPart2 = cBorder(` ${h.repeat(Math.max(0, width - (title.length + 4)))}${tr}`);
        const topLine = `${topPart1}${topTitle}${topPart2}`;
        const formatLine = (label: string, value: string, valStyle: (s: string) => string) => {
             const prefix = cBorder(`${v}`) + paint.apply(bullet, [paint.colors.accent]) + ' ';
             const txtLabel = KaiChroma.style(label, { bold: true }); // label color?
             const txtValue = valStyle(value);
             return `${prefix}${paint.apply(txtLabel, [paint.colors.dim])} ${txtValue}`;
        };
        const line1 = formatLine(labelActual, current, (s) => paint.apply(s, paint.colors.error));
        const line2 = formatLine(labelNueva, latest, (s) => paint.apply(s, paint.colors.success)); 
        const line3 = formatLine(labelInstall, cmd, (s) => paint.apply(s, paint.colors.warning));
        const bottomLine = cBorder(`${bl}${h.repeat(width - 1)}${br}`);
        console.log('');
        console.log(topLine);
        console.log(line1);
        console.log(line2);
        console.log(line3);
        console.log(bottomLine);
        console.log('');
    }
}