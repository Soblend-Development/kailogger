
import { paint } from '../styles/palettes';

export class KaiDiff {
    static print(before: any, after: any, theme: any, path: string = ''): void {
        const allKeys = new Set([
            ...Object.keys(before || {}),
            ...Object.keys(after || {})
        ]);
        allKeys.forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            const oldVal = before?.[key];
            const newVal = after?.[key];
            if (oldVal === undefined && newVal !== undefined) {
                console.log(paint.apply(`+ ${fullPath}: ${JSON.stringify(newVal)}`, theme.success));
            } else if (oldVal !== undefined && newVal === undefined) {
                console.log(paint.apply(`- ${fullPath}: ${JSON.stringify(oldVal)}`, theme.error));
            } else if (typeof oldVal === 'object' && typeof newVal === 'object' && oldVal !== null && newVal !== null) {
                KaiDiff.print(oldVal, newVal, theme, fullPath);
            } else if (oldVal !== newVal) {
                console.log(paint.apply(`~ ${fullPath}: ${JSON.stringify(oldVal)} → ${JSON.stringify(newVal)}`, theme.warning));
            }
        });
    }
}