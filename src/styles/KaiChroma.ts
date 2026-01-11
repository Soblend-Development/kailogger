import os from 'os';

export type Color = [number, number, number];
export type HexColor = string;
export type RgbColor = { r: number; g: number; b: number };
export type HslColor = { h: number; s: number; l: number };
export type ColorStop = { color: string; position: number };
export type GradientOptions = {
  interpolation?: 'linear' | 'ease' | 'bezier' | 'smooth';
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  stops?: ColorStop[];
};
export type StyleOptions = {
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
  inverse?: boolean;
  strikethrough?: boolean;
  blink?: boolean;
  hidden?: boolean;
};
const env = process.env;
const isTTY = process.stdout.isTTY;
const platform = os.platform();
const supportLevel = (() => {
  if (env.CI && !env.FORCE_COLOR) return 0;
  if (!isTTY && !env.FORCE_COLOR) return 0;
  if (env.FORCE_COLOR === '0') return 0;
  if (env.FORCE_COLOR === '1') return 1;
  if (env.FORCE_COLOR === '2') return 2;
  if (env.FORCE_COLOR === '3') return 3;
  if (platform === 'win32') {
    if (env.WT_SESSION || env.ConEmuANSI === 'ON') return 3;
  }
  if (env.COLORTERM === 'truecolor' || env.COLORTERM === '24bit') return 3;
  if (env.TERM_PROGRAM === 'iTerm.app') return 3;
  if (env.TERM_PROGRAM === 'Apple_Terminal') return 2;
  if (env.TERM_PROGRAM === 'Hyper') return 3;
  if (env.TERM_PROGRAM === 'vscode') return 3;
  const term = env.TERM || '';
  if (term.includes('truecolor') || term.includes('24bit')) return 3;
  if (term.includes('256color')) return 2;
  if (term === 'xterm' || term === 'screen' || term === 'linux') return 1;
  return isTTY ? 1 : 0;
})();
export class KaiChroma {
  private static cache = new Map<string, string>();
  private static readonly MAX_CACHE_SIZE = 1000;
  private static hexToRgb(hex: string): Color {
    const cleanHex = hex.replace(/^#/, '');
    const bigint = parseInt(cleanHex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }
  private static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  private static rgbToHsl(r: number, g: number, b: number): HslColor {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  private static hslToRgb(h: number, s: number, l: number): Color {
    h /= 360; s /= 100; l /= 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    if (s === 0) {
      const val = Math.round(l * 255);
      return [val, val, val];
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1/3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1/3) * 255)
    ];
  }
  private static rgbToAnsi256(r: number, g: number, b: number): number {
    if (r === g && g === b) {
      if (r < 8) return 16;
      if (r > 248) return 231;
      return Math.round(((r - 8) / 247) * 24) + 232;
    }
    return 16 + (36 * Math.round(r / 255 * 5)) + (6 * Math.round(g / 255 * 5)) + Math.round(b / 255 * 5);
  }
  private static interpolateLinear(start: Color, end: Color, t: number): Color {
    return [
      Math.round(start[0] + (end[0] - start[0]) * t),
      Math.round(start[1] + (end[1] - start[1]) * t),
      Math.round(start[2] + (end[2] - start[2]) * t)
    ];
  }
  private static interpolateEase(start: Color, end: Color, t: number): Color {
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return this.interpolateLinear(start, end, eased);
  }
  private static interpolateBezier(start: Color, end: Color, t: number): Color {
    const bezier = t * t * (3 - 2 * t);
    return this.interpolateLinear(start, end, bezier);
  }
  private static interpolateSmooth(start: Color, end: Color, t: number): Color {
    const smooth = t * t * t * (t * (t * 6 - 15) + 10);
    return this.interpolateLinear(start, end, smooth);
  }
  static hex(hex: string, text: string): string {
    if (supportLevel === 0) return text;
    const cacheKey = `hex:${hex}:${supportLevel}`;
    const [r, g, b] = this.hexToRgb(hex);
    if (supportLevel === 3) {
      return `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m`;
    } else if (supportLevel === 2) {
      return `\x1b[38;5;${this.rgbToAnsi256(r, g, b)}m${text}\x1b[39m`;
    }
    return text;
  }
  static rgb(r: number, g: number, b: number, text: string): string {
    if (supportLevel === 0) return text;
    if (supportLevel === 3) {
      return `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m`;
    } else if (supportLevel === 2) {
      return `\x1b[38;5;${this.rgbToAnsi256(r, g, b)}m${text}\x1b[39m`;
    }
    return text;
  }
  static hsl(h: number, s: number, l: number, text: string): string {
    const [r, g, b] = this.hslToRgb(h, s, l);
    return this.rgb(r, g, b, text);
  }
  static bgHex(hex: string, text: string): string {
    if (supportLevel === 0) return text;
    const [r, g, b] = this.hexToRgb(hex);
    if (supportLevel === 3) {
      return `\x1b[48;2;${r};${g};${b}m${text}\x1b[49m`;
    } else if (supportLevel === 2) {
      return `\x1b[48;5;${this.rgbToAnsi256(r, g, b)}m${text}\x1b[49m`;
    }
    return text;
  }
  static bgRgb(r: number, g: number, b: number, text: string): string {
    if (supportLevel === 0) return text;
    if (supportLevel === 3) {
      return `\x1b[48;2;${r};${g};${b}m${text}\x1b[49m`;
    } else if (supportLevel === 2) {
      return `\x1b[48;5;${this.rgbToAnsi256(r, g, b)}m${text}\x1b[49m`;
    }
    return text;
  }
  static bold(text: string): string { return `\x1b[1m${text}\x1b[22m`; }
  static dim(text: string): string { return `\x1b[2m${text}\x1b[22m`; }
  static italic(text: string): string { return `\x1b[3m${text}\x1b[23m`; }
  static underline(text: string): string { return `\x1b[4m${text}\x1b[24m`; }
  static inverse(text: string): string { return `\x1b[7m${text}\x1b[27m`; }
  static hidden(text: string): string { return `\x1b[8m${text}\x1b[28m`; }
  static strikethrough(text: string): string { return `\x1b[9m${text}\x1b[29m`; }
  static blink(text: string): string { return `\x1b[5m${text}\x1b[25m`; }
  static style(text: string, options: StyleOptions): string {
    let result = text;
    if (options.bold) result = this.bold(result);
    if (options.dim) result = this.dim(result);
    if (options.italic) result = this.italic(result);
    if (options.underline) result = this.underline(result);
    if (options.inverse) result = this.inverse(result);
    if (options.strikethrough) result = this.strikethrough(result);
    if (options.blink) result = this.blink(result);
    if (options.hidden) result = this.hidden(result);
    return result;
  }
  static gradient(colors: string[], text: string, options: GradientOptions = {}): string {
    if (supportLevel === 0) return text;
    if (colors.length < 2) return this.hex(colors[0] || '#ffffff', text);
    const interpolation = options.interpolation || 'linear';
    const rgbColors = colors.map(c => this.hexToRgb(c));
    const chars = [...text];
    const steps = chars.length;
    let output = '';
    const interpolate = (start: Color, end: Color, t: number): Color => {
      switch (interpolation) {
        case 'ease': return this.interpolateEase(start, end, t);
        case 'bezier': return this.interpolateBezier(start, end, t);
        case 'smooth': return this.interpolateSmooth(start, end, t);
        default: return this.interpolateLinear(start, end, t);
      }
    };
    chars.forEach((char, i) => {
      const t = steps <= 1 ? 0 : i / (steps - 1);
      const segmentLength = 1 / (rgbColors.length - 1);
      const segmentIndex = Math.min(Math.floor(t / segmentLength), rgbColors.length - 2);
      const segmentT = (t - (segmentIndex * segmentLength)) / segmentLength;
      const [r, g, b] = interpolate(rgbColors[segmentIndex], rgbColors[segmentIndex + 1], segmentT);
      if (supportLevel === 3) {
        output += `\x1b[38;2;${r};${g};${b}m${char}`;
      } else if (supportLevel === 2) {
        output += `\x1b[38;5;${this.rgbToAnsi256(r, g, b)}m${char}`;
      } else {
        output += char;
      }
    });
    return output + '\x1b[39m';
  }
  static rainbowGradient(text: string): string {
    return this.gradient(
      ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
      text,
      { interpolation: 'smooth' }
    );
  }
  static sunsetGradient(text: string): string {
    return this.gradient(['#FF512F', '#F09819', '#FFD89B'], text, { interpolation: 'ease' });
  }
  static oceanGradient(text: string): string {
    return this.gradient(['#667eea', '#764ba2', '#f093fb'], text, { interpolation: 'bezier' });
  }
  static fireGradient(text: string): string {
    return this.gradient(['#ff0000', '#ff4500', '#ffa500', '#ffff00'], text, { interpolation: 'smooth' });
  }
  static matrixGradient(text: string): string {
    return this.gradient(['#00ff00', '#00cc00', '#009900'], text, { interpolation: 'linear' });
  }
  static lighten(hex: string, amount: number): string {
    const [r, g, b] = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.l = Math.min(100, hsl.l + amount);
    const [nr, ng, nb] = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(nr, ng, nb);
  }
  static darken(hex: string, amount: number): string {
    return this.lighten(hex, -amount);
  }
  static saturate(hex: string, amount: number): string {
    const [r, g, b] = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.s = Math.min(100, hsl.s + amount);
    const [nr, ng, nb] = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(nr, ng, nb);
  }
  static desaturate(hex: string, amount: number): string {
    return this.saturate(hex, -amount);
  }
  static rotate(hex: string, degrees: number): string {
    const [r, g, b] = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.h = (hsl.h + degrees) % 360;
    if (hsl.h < 0) hsl.h += 360;
    const [nr, ng, nb] = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(nr, ng, nb);
  }
  static mix(hex1: string, hex2: string, weight: number = 0.5): string {
    const [r1, g1, b1] = this.hexToRgb(hex1);
    const [r2, g2, b2] = this.hexToRgb(hex2);
    const [r, g, b] = this.interpolateLinear([r1, g1, b1], [r2, g2, b2], weight);
    return this.rgbToHex(r, g, b);
  }
  static analogous(hex: string, count: number = 3): string[] {
    const palette: string[] = [hex];
    const step = 30;
    for (let i = 1; i < count; i++) {
      palette.push(this.rotate(hex, step * i));
    }
    return palette;
  }
  static complementary(hex: string): string[] {
    return [hex, this.rotate(hex, 180)];
  }
  static triadic(hex: string): string[] {
    return [hex, this.rotate(hex, 120), this.rotate(hex, 240)];
  }
  static tetradic(hex: string): string[] {
    return [hex, this.rotate(hex, 90), this.rotate(hex, 180), this.rotate(hex, 270)];
  }
  static monochromatic(hex: string, count: number = 5): string[] {
    const palette: string[] = [];
    const step = 100 / (count - 1);
    for (let i = 0; i < count; i++) {
      palette.push(this.lighten(hex, -50 + step * i));
    }
    return palette;
  }
  static strip(text: string): string {
    return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  }
  static getSupport(): number {
    return supportLevel;
  }
  static getSupportName(): string {
    const names = ['none', 'basic', '256', 'truecolor'];
    return names[supportLevel];
  }
  static isSupported(): boolean {
    return supportLevel > 0;
  }
  static textLength(text: string): number {
    return this.strip(text).length;
  }
  static box(text: string, color: string = '#ffffff', padding: number = 1): string {
    const lines = text.split('\n');
    const maxLen = Math.max(...lines.map(l => this.textLength(l)));
    const pad = ' '.repeat(padding);
    const width = maxLen + padding * 2;
    const top = this.hex(color, '┌' + '─'.repeat(width) + '┐');
    const bottom = this.hex(color, '└' + '─'.repeat(width) + '┘');
    const content = lines.map(line => {
      const spaces = ' '.repeat(maxLen - this.textLength(line));
      return this.hex(color, '│') + pad + line + spaces + pad + this.hex(color, '│');
    }).join('\n');
    return `${top}\n${content}\n${bottom}`;
  }
  static wave(text: string, colors: string[]): string {
    if (supportLevel === 0) return text;
    const chars = [...text];
    const rgbColors = colors.map(c => this.hexToRgb(c));
    let output = '';
    chars.forEach((char, i) => {
      const colorIndex = Math.floor((Math.sin(i * 0.5) + 1) * (rgbColors.length - 1) / 2);
      const [r, g, b] = rgbColors[colorIndex];
      if (supportLevel === 3) {
        output += `\x1b[38;2;${r};${g};${b}m${char}`;
      } else if (supportLevel === 2) {
        output += `\x1b[38;5;${this.rgbToAnsi256(r, g, b)}m${char}`;
      } else {
        output += char;
      }
    });

    return output + '\x1b[39m';
  }
  static pulse(text: string, color: string, frames: number = 10): string[] {
    const result: string[] = [];
    const [r, g, b] = this.hexToRgb(color);
    for (let i = 0; i < frames; i++) {
      const brightness = (Math.sin((i / frames) * Math.PI * 2) + 1) / 2;
      const adjustedR = Math.round(r * brightness);
      const adjustedG = Math.round(g * brightness);
      const adjustedB = Math.round(b * brightness);
      result.push(this.rgb(adjustedR, adjustedG, adjustedB, text));
    }
    return result;
  }
  private static clearCacheIfNeeded(): void {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entriesToDelete = this.cache.size - this.MAX_CACHE_SIZE / 2;
      const iterator = this.cache.keys();
      for (let i = 0; i < entriesToDelete; i++) {
        const key = iterator.next().value;
        if (key) this.cache.delete(key);
      }
    }
  }
}

export default KaiChroma;