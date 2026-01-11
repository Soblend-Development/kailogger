import { kai } from '../src';
import * as path from 'path';

async function runDemo() {
    console.clear();
    kai.setSoundsDir(path.join(__dirname, '../src/sounds'));
    kai.box('KaiLogger v1.0.1', 'Now with Charts, Notifications, Screenshots & More!');
    console.log('\n');
    kai.info('📋 Basic Logging');
    kai.success('Operation completed');
    kai.warning('Low memory');
    kai.error('Connection failed');
    console.log('\n');
    kai.info('📊 Charts Demo');
    kai.chart([
        { label: 'Users', value: 1500 },
        { label: 'Sales', value: 890 },
        { label: 'Orders', value: 450 },
        { label: 'Returns', value: 32 }
    ]);
    
    // Sparkline
    kai.info('📈 Sparkline (CPU usage over time)');
    kai.sparkline([10, 25, 30, 15, 45, 60, 55, 70, 85, 60, 40, 30]);
    
    // Gauge
    console.log('');
    kai.gauge(75, 100, 'Memory');
    kai.gauge(45, 100, 'CPU');
    kai.gauge(95, 100, 'Disk');
    
    // ===== ENCRYPTION =====
    console.log('\n');
    kai.info('🔐 Encryption Demo');
    
    kai.masked('API Key', 'sk-1234567890abcdef', 4);
    kai.masked('Password', 'superSecretPassword123', 3);
    
    kai.encrypted('This is a secret message!', 'my-secret-key');
    
    // ===== TREE =====
    console.log('\n');
    kai.info('🌳 Tree View');
    
    kai.tree({
        src: {
            core: { 'Logger.ts': null },
            features: { 'Chart.ts': null, 'Sound.ts': null },
            sounds: { 'success.wav': null, 'error.wav': null }
        },
        'package.json': null
    });
    
    // ===== TABLE =====
    console.log('\n');
    kai.info('📉 Table');
    
    kai.table([
        { name: 'Kai', role: 'Admin', status: '🟢' },
        { name: 'Neo', role: 'User', status: '🟡' },
        { name: 'Trinity', role: 'Mod', status: '🔴' }
    ]);
    
    // ===== SOUNDS =====
    console.log('\n');
    kai.info('🔊 Sound Demo');
    
    kai.info('Playing success sound...');
    await kai.soundSuccess();
    await new Promise(r => setTimeout(r, 500));
    
    kai.warning('Playing warning sound...');
    await kai.soundWarning();
    await new Promise(r => setTimeout(r, 500));
    
    kai.error('Playing error sound...');
    await kai.soundError();
    await new Promise(r => setTimeout(r, 500));
    
    // ===== NOTIFICATION =====
    console.log('\n');
    kai.info('💬 Sending Desktop Notification...');
    kai.notify('KaiLogger demo finished!', '✅ Success');
    await kai.soundNotification();
    
    // ===== DONE =====
    console.log('\n');
    kai.success('✨ Demo complete! KaiLogger v2.1.0 is ready.');
}

runDemo();