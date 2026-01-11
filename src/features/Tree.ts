
import { KaiChroma } from '../styles/KaiChroma';
import { paint } from '../styles/palettes';

interface TreeNode {
    [key: string]: TreeNode | null;
}
export class KaiTree {
    static print(obj: TreeNode, theme: any, prefix: string = '', isLast: boolean = true): void {
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
            const isLastItem = index === keys.length - 1;
            const connector = isLastItem ? '└── ' : '├── ';
            const value = obj[key];
            const line = prefix + connector; // connector + key part
            if (value === null) {
                console.log(KaiChroma.hex(theme.dim, prefix + connector) + paint.apply(key, theme.info));
            } else {
                console.log(KaiChroma.hex(theme.dim, prefix + connector) + paint.apply(key + '/', theme.success));
                const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
                KaiTree.print(value, theme, newPrefix, isLastItem);
            }
        });
    }
}