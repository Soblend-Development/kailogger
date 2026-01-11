
import { KaiChroma } from './KaiChroma';

export type ThemeName = 
    | 'zen' 
    | 'neon' 
    | 'pastel' 
    | 'hacker' 
    | 'sunset' 
    | 'ocean' 
    | 'cyberpunk' 
    | 'dracula' 
    | 'monokai' 
    | 'vaporwave' 
    | 'midnight' 
    | 'forest'
    | 'volcano'
    | 'gold';

export interface Theme {
    success: string[]; // Gradient colors
    error: string[];
    warning: string[];
    info: string[];
    debug: string[];
    text: string;     // Base text color
    dim: string;      // Dimmed color
    accent: string;   // Special accent
    bg?: string;      // Background recommendation
}

export const palettes: Record<ThemeName, Theme> = {
    // 1. Zen (Minimalist, calming)
    zen: {
        success: ['#00b09b', '#96c93d'],
        error: ['#ff416c', '#ff4b2b'],
        warning: ['#f7971e', '#ffd200'],
        info: ['#2193b0', '#6dd5ed'],
        debug: ['#8e2de2', '#4a00e0'],
        text: '#ffffff',
        dim: '#888888',
        accent: '#00b09b'
    },
    // 2. Neon (Bright, cyber)
    neon: {
        success: ['#39ff14', '#00ffef'],
        error: ['#ff0055', '#ff0099'],
        warning: ['#ffff00', '#ffae00'],
        info: ['#00ffff', '#0099ff'],
        debug: ['#b300ff', '#8800ff'],
        text: '#f0f0f0',
        dim: '#666666',
        accent: '#39ff14'
    },
    // 3. Cyberpunk 2077
    cyberpunk: {
        success: ['#00ff9f', '#00b8ff'], // Cyan to Blue
        error: ['#ff003c', '#ff3cac'],   // Cyber Red
        warning: ['#fcee0a', '#ffae00'], // Cyber Yellow
        info: ['#0abdc6', '#ea00d9'],    // Blue to Pink
        debug: ['#711c91', '#ea00d9'],   // Purple
        text: '#fcee0a',                 // Yellow text
        dim: '#5e4e69',
        accent: '#0abdc6'
    },
    // 4. Dracula (Dark mode favorite)
    dracula: {
        success: ['#50fa7b', '#8be9fd'],
        error: ['#ff5555', '#ffb86c'],
        warning: ['#ffb86c', '#f1fa8c'],
        info: ['#bd93f9', '#ff79c6'],
        debug: ['#6272a4', '#8be9fd'],
        text: '#f8f8f2',
        dim: '#6272a4',
        accent: '#bd93f9'
    },
    // 5. Monokai
    monokai: {
        success: ['#a6e22e', '#a6e22e'],
        error: ['#f92672', '#f92672'],
        warning: ['#fd971f', '#e6db74'],
        info: ['#66d9ef', '#ae81ff'],
        debug: ['#ae81ff', '#fd971f'],
        text: '#f8f8f2',
        dim: '#75715e',
        accent: '#a6e22e'
    },
    // 6. Vaporwave
    vaporwave: {
        success: ['#00f0ff', '#ff00aa'],
        error: ['#ff2a00', '#ff0066'],
        warning: ['#ffcc00', '#ff9900'],
        info: ['#ff77ff', '#9933ff'],
        debug: ['#9900ff', '#5500aa'],
        text: '#ff99ff',
        dim: '#554477',
        accent: '#00f0ff'
    },
    // 7. Midnight (Deep blues)
    midnight: {
        success: ['#34e89e', '#0f3443'],
        error: ['#cb2d3e', '#ef473a'],
        warning: ['#ffc371', '#ff5f6d'],
        info: ['#56ccf2', '#2f80ed'],
        debug: ['#642b73', '#c6426e'],
        text: '#d1d1d1',
        dim: '#4b5563',
        accent: '#56ccf2'
    },
    // 8. Sunset (Warm)
    sunset: {
        success: ['#11998e', '#38ef7d'],
        error: ['#ee0979', '#ff6a00'],
        warning: ['#ff9966', '#ff5e62'],
        info: ['#00c6ff', '#0072ff'],
        debug: ['#8360c3', '#2ebf91'],
        text: '#ffedd5',
        dim: '#7c2d12',
        accent: '#ff9966'
    },
    // 9. Ocean (Blues/Greens)
    ocean: {
        success: ['#4cb8c4', '#3cd3ad'],
        error: ['#ff416c', '#ff4b2b'],
        warning: ['#f09819', '#edde5d'],
        info: ['#2b5876', '#4e4376'],
        debug: ['#1c92d2', '#f2fcfe'],
        text: '#e0f2fe',
        dim: '#1e3a8a',
        accent: '#4cb8c4'
    },
    // 10. Pastel (Soft)
    pastel: {
        success: ['#B2F7EF', '#7BDFF2'],
        error: ['#FFB7B2', '#FF9AA2'],
        warning: ['#FFE29A', '#FFDAC1'],
        info: ['#A0E7E5', '#B4F8C8'],
        debug: ['#FBE7C6', '#C3B1E1'],
        text: '#ffffff',
        dim: '#a0a0a0',
        accent: '#B2F7EF'
    },
    // 11. Hacker
    hacker: {
        success: ['#00ff00', '#003300'],
        error: ['#ff0000', '#330000'],
        warning: ['#ffff00', '#333300'],
        info: ['#0000ff', '#000033'],
        debug: ['#ff00ff', '#330033'],
        text: '#00ff00',
        dim: '#004400',
        accent: '#00ff00'
    },
    // 12. Volcano
    volcano: {
        success: ['#FF8008', '#FFC837'],
        error: ['#FF0000', '#950000'],
        warning: ['#FF4B1F', '#1FDDFF'],
        info: ['#ED4264', '#FFEDBC'],
        debug: ['#2C3E50', '#FD746C'],
        text: '#FFD700',
        dim: '#500000',
        accent: '#FF4B1F'
    },
    // 13. Forest
    forest: {
        success: ['#134E5E', '#71B280'],
        error: ['#603813', '#b29f94'],
        warning: ['#eacda3', '#d6ae7b'],
        info: ['#5D4157', '#A8CABA'],
        debug: ['#4DA0B0', '#D39D38'],
        text: '#D4FFD6',
        dim: '#2b3d2b',
        accent: '#71B280'
    },
    // 14. Gold (Luxury)
    gold: {
        success: ['#F2994A', '#F2C94C'],
        error: ['#8e2de2', '#4a00e0'],
        warning: ['#CAC531', '#F3F9A7'],
        info: ['#7F7FD5', '#86A8E7'],
        debug: ['#E0EAFC', '#CFDEF3'],
        text: '#FFD700',
        dim: '#706015',
        accent: '#F2C94C'
    }
};

export class PaletteEngine {
    private currentTheme: ThemeName = 'zen';
    private theme: Theme = palettes.zen;

    setTheme(name: ThemeName) {
        if (palettes[name]) {
            this.currentTheme = name;
            this.theme = palettes[name];
        }
    }

    get colors() {
        return this.theme;
    }

    apply(text: string, colors: string[]): string {
        if (colors.length === 1) return KaiChroma.hex(colors[0], text);
        return KaiChroma.gradient(colors, text);
    }
}

export const paint = new PaletteEngine();