import gradient from 'gradient-string';
import { palettes, ThemeName } from './palettes';

export class GradientEngine {
    private currentTheme: ThemeName = 'zen';
    setTheme(theme: ThemeName) {
        if (palettes[theme]) {
            this.currentTheme = theme;
        }
    }
    get text() {
        return palettes[this.currentTheme];
    }
    apply(text: string, colors: string[]) {
        return gradient(colors)(text);
    }
    multiline(text: string, colors: string[]) {
        return gradient(colors).multiline(text);
    }
}

export const paint = new GradientEngine();