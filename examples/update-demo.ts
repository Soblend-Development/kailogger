import { KaiUpdateNotifier } from '../src/features/UpdateNotifier';
import { paint } from '../src/styles/palettes';

paint.setTheme('zen');
console.log('Testing Update Notifier UI...');
const mockUpdate = {
    latest: '2.0.0',
    current: '1.0.0',
    type: 'major',
    name: 'kailogger'
};

// @ts-ignore
KaiUpdateNotifier.show(mockUpdate, 'kailogger');
