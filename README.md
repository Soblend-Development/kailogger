# KaiLogger

> The Ultimate Logger for Node.js — Beautiful, powerful, and designed for developers who care about aesthetics.

<p align="center">
  <img src="https://files.catbox.moe/et33ah.png" alt="KaiLogger Logo" width="600" />
</p>

![Version](https://img.shields.io/badge/version-1.0.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)

Turn your boring console logs into a cyber-aesthetic experience. KaiLogger is a complete CLI toolkit featuring a custom high-performance color engine (KaiChroma) with TrueColor support, gradients, and 14 built-in themes.

---

## Features

| Category        | Features                                                       |
| --------------- | -------------------------------------------------------------- |
| **Logging**     | Log levels, scoped loggers, custom badges, silent mode         |
| **Styling**     | **14 Themes**, custom gradients, KaiChroma engine (TrueColor)  |
| **Interactive** | Spinners, progress bars, select menus, prompts                 |
| **Debug**       | Pretty errors, JSON highlighting, diff view, tree view         |
| **Visuals**     | **Charts** (Bar, Sparkline, Gauge), **Screenshots** (TXT/HTML) |
| **System**      | **Desktop Notifications**, **Encryption**, **Sound Alerts**    |
| **Transports**  | Console, File (with rotation), Webhooks                        |

---

## Installation

```bash
npm install kailogger
```

---

## Quick Start

```typescript
import { kai } from "kailogger";

kai.success("Hello, beautiful world!");
kai.error("Something went wrong");
kai.warning("Careful there");
kai.info("Just FYI");
kai.debug("For your eyes only");

// Enable sound
kai.beep();
```

---

## Themes

Switch between 14 stunning themes powered by our custom KaiChroma engine.

```typescript
kai.setTheme("cyberpunk");
```

**Available Themes:**

- `zen` (Minimalist)
- `neon` (Bright cyber)
- `pastel` (Soft colors)
- `hacker` (Matrix style)
- `sunset` (Warm gradients)
- `ocean` (Blue/Green tones)
- `cyberpunk` (Blue/Pink/Yellow)
- `dracula` (Dark mode favorite)
- `monokai` (Classic code style)
- `vaporwave` (Aesthetic purple/cyan)
- `midnight` (Deep blues)
- `forest` (Nature tones)
- `volcano` (Fiery reds/oranges)
- `gold` (Luxury)

---

## Charts

Visualize data directly in your terminal.

**Bar Chart**

```typescript
kai.chart([
  { label: "Users", value: 1500 },
  { label: "Sales", value: 890 },
  { label: "Errors", value: 32 },
]);
```

**Sparkline**

```typescript
kai.sparkline([10, 25, 40, 35, 60, 90, 45, 20]);
// Output: ▂▃▄▃▅▇▄▂
```

**Gauge**

```typescript
kai.gauge(75, 100, "CPU");
// CPU: [███████████████░░░░░] 75%
```

---

## Notifications & Sounds

**Desktop Notifications**
Send native system notifications.

```typescript
kai.notify("Build complete!", "Success");
```

**Sound Alerts**
Play sounds for events (Success, Error, Warning, Notification).

```typescript
// Optional: Set custom sounds directory
kai.setSoundsDir("./src/sounds");

await kai.soundSuccess();
await kai.soundError();
kai.playSound("custom.wav");
```

---

## Encryption

Handle sensitive data securely.

```typescript
// Mask sensitive info in logs
kai.masked("API Key", "sk-1234567890abcdef", 4);
// API Key: ************cdef

// Encrypt/Decrypt helpers
const secret = kai.encrypted("My Secret Data", "my-key");
kai.decrypted(secret, "my-key");
```

---

## Screen Capture

Capture terminal output to file.

```typescript
kai.startCapture();

kai.success("This will be captured");
kai.info("So will this");

kai.saveScreenshot("logs/session.txt");
kai.saveScreenshotHtml("logs/session.html"); // Saves as styled HTML!
```

---

## Log Levels & Scopes

```typescript
// Set global level
kai.setLevel("warning");

// Scoped Logger
const db = kai.scope("Database");
db.info("Connected"); // [Database] Connected
```

---

## Tree & Diff View

```typescript
// Tree View
kai.tree({
  src: { "index.ts": null, utils: { "helper.ts": null } },
});

// Diff View
kai.diff({ status: "idle" }, { status: "active" });
```

---

## Interactive Prompts

```typescript
const name = await kai.ask("Name?");
const framework = await kai.select("Framework", ["React", "Vue", "Svelte"]);

// Progress Bar
const bar = kai.createProgress(100);
bar.update(50);
```

---

## Transports

```typescript
kai.addFileTransport({
  filename: "./logs/app.log",
  maxSize: 10 * 1024 * 1024,
});

kai.addWebhookTransport({
  url: "https://webhook.site/...",
});
```

---

## License

ISC

---

**By Soblend Development Studio**
