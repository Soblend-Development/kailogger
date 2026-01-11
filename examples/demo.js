"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var path = require("path");
function runDemo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    src_1.kai.setSoundsDir(path.join(__dirname, '../src/sounds'));
                    src_1.kai.box('KaiLogger v1.0.1', 'Now with Charts, Notifications, Screenshots & More!');
                    console.log('\n');
                    src_1.kai.info('📋 Basic Logging');
                    src_1.kai.success('Operation completed');
                    src_1.kai.warning('Low memory');
                    src_1.kai.error('Connection failed');
                    console.log('\n');
                    src_1.kai.info('📊 Charts Demo');
                    src_1.kai.chart([
                        { label: 'Users', value: 1500 },
                        { label: 'Sales', value: 890 },
                        { label: 'Orders', value: 450 },
                        { label: 'Returns', value: 32 }
                    ]);
                    // Sparkline
                    src_1.kai.info('📈 Sparkline (CPU usage over time)');
                    src_1.kai.sparkline([10, 25, 30, 15, 45, 60, 55, 70, 85, 60, 40, 30]);
                    // Gauge
                    console.log('');
                    src_1.kai.gauge(75, 100, 'Memory');
                    src_1.kai.gauge(45, 100, 'CPU');
                    src_1.kai.gauge(95, 100, 'Disk');
                    // ===== ENCRYPTION =====
                    console.log('\n');
                    src_1.kai.info('🔐 Encryption Demo');
                    src_1.kai.masked('API Key', 'sk-1234567890abcdef', 4);
                    src_1.kai.masked('Password', 'superSecretPassword123', 3);
                    src_1.kai.encrypted('This is a secret message!', 'my-secret-key');
                    // ===== TREE =====
                    console.log('\n');
                    src_1.kai.info('🌳 Tree View');
                    src_1.kai.tree({
                        src: {
                            core: { 'Logger.ts': null },
                            features: { 'Chart.ts': null, 'Sound.ts': null },
                            sounds: { 'success.wav': null, 'error.wav': null }
                        },
                        'package.json': null
                    });
                    // ===== TABLE =====
                    console.log('\n');
                    src_1.kai.info('📉 Table');
                    src_1.kai.table([
                        { name: 'Kai', role: 'Admin', status: '🟢' },
                        { name: 'Neo', role: 'User', status: '🟡' },
                        { name: 'Trinity', role: 'Mod', status: '🔴' }
                    ]);
                    // ===== SOUNDS =====
                    console.log('\n');
                    src_1.kai.info('🔊 Sound Demo');
                    src_1.kai.info('Playing success sound...');
                    return [4 /*yield*/, src_1.kai.soundSuccess()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                case 2:
                    _a.sent();
                    src_1.kai.warning('Playing warning sound...');
                    return [4 /*yield*/, src_1.kai.soundWarning()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                case 4:
                    _a.sent();
                    src_1.kai.error('Playing error sound...');
                    return [4 /*yield*/, src_1.kai.soundError()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 500); })];
                case 6:
                    _a.sent();
                    // ===== NOTIFICATION =====
                    console.log('\n');
                    src_1.kai.info('💬 Sending Desktop Notification...');
                    src_1.kai.notify('KaiLogger demo finished!', '✅ Success');
                    return [4 /*yield*/, src_1.kai.soundNotification()];
                case 7:
                    _a.sent();
                    // ===== DONE =====
                    console.log('\n');
                    src_1.kai.success('✨ Demo complete! KaiLogger v2.1.0 is ready.');
                    return [2 /*return*/];
            }
        });
    });
}
runDemo();
