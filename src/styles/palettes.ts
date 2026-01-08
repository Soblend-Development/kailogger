export const palettes = {
    zen: {
        success: ['#00b09b', '#96c93d'],
        error: ['#ff416c', '#ff4b2b'],
        warning: ['#f7971e', '#ffd200'],
        info: ['#2193b0', '#6dd5ed'],
        debug: ['#8e2de2', '#4a00e0'],
        light: '#ffffff',
        dim: '#888888'
    },
    neon: {
        success: ['#39FF14', '#00FF00'],
        error: ['#FF00FF', '#FF0099'],
        warning: ['#FFFF00', '#FFD700'],
        info: ['#00FFFF', '#00BFFF'],
        debug: ['#9D00FF', '#7F00FF'],
        light: '#ffffff',
        dim: '#444444'
    },
    pastel: {
        success: ['#77DD77', '#55BB55'],
        error: ['#FF6961', '#FF4444'],
        warning: ['#FFB347', '#FF9933'],
        info: ['#AEC6CF', '#88aabb'],
        debug: ['#B39EB5', '#9988aa'],
        light: '#ffffff',
        dim: '#999999'
    },
    hacker: {
        success: ['#0f0', '#00ff00'],
        error: ['#f00', '#ff0000'],
        warning: ['#ff0', '#ffff00'],
        info: ['#00f', '#0000ff'],
        debug: ['#0ff', '#00ffff'],
        light: '#ccffcc',
        dim: '#003300'
    },
    sunset: {
        success: ['#11998e', '#38ef7d'],
        error: ['#cb2d3e', '#ef473a'],
        warning: ['#fc4a1a', '#f7b733'],
        info: ['#36D1DC', '#5B86E5'],
        debug: ['#8E2DE2', '#4A00E0'],
        light: '#fff5f5',
        dim: '#553333'
    },
    ocean: {
        success: ['#48c6ef', '#6f86d6'],
        error: ['#fe8c00', '#f83600'],
        warning: ['#f09819', '#edde5d'],
        info: ['#00c6ff', '#0072ff'],
        debug: ['#1c92d2', '#f2fcfe'],
        light: '#f0f8ff',
        dim: '#334455'
    }
};

export type ThemeName = keyof typeof palettes;