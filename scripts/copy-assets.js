
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

console.log('📦 Copying assets...');

// Copy sounds
const soundsSrc = path.join(srcDir, 'sounds');
const soundsDist = path.join(distDir, 'sounds');

if (fs.existsSync(soundsSrc)) {
    if (!fs.existsSync(soundsDist)) fs.mkdirSync(soundsDist, { recursive: true });
    fs.readdirSync(soundsSrc).forEach(file => {
        if (file.endsWith('.wav') || file.endsWith('.mp3')) {
            fs.copyFileSync(path.join(soundsSrc, file), path.join(soundsDist, file));
        }
    });
    console.log('  ✔ Sounds copied');
}

// Copy icon
const iconSrc = path.join(srcDir, 'icon');
const iconDist = path.join(distDir, 'icon');

if (fs.existsSync(iconSrc)) {
    if (!fs.existsSync(iconDist)) fs.mkdirSync(iconDist, { recursive: true });
    fs.readdirSync(iconSrc).forEach(file => {
        fs.copyFileSync(path.join(iconSrc, file), path.join(iconDist, file));
    });
    console.log('  ✔ Icon copied');
}

console.log('✨ Build assets complete');
