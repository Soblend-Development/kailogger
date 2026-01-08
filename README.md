# KaiLogger

> **The Ultimate Logger for Node.js** — Beautiful, powerful, and designed for developers who care about aesthetics.

<p align="center">
  <img src="https://files.catbox.moe/et33ah.png" alt="KaiLogger Logo" width="600" />
</p>

![Version](https://img.shields.io/badge/version-1.0.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6)

Turn your boring console logs into a cyber-aesthetic experience. KaiLogger isn't just a logger; it's a complete CLI toolkit.

---

## Features

| Category        | Features                                                    |
| --------------- | ----------------------------------------------------------- |
| **Logging**     | Log levels, scoped loggers, custom badges, silent mode      |
| **Styling**     | 6 built-in themes, gradients, pretty boxes                  |
| **Interactive** | Spinners, progress bars, select menus, prompts              |
| **Debug**       | Pretty errors, JSON highlighting, diff view, tree view      |
| **Visuals**     | **Charts** (Bar, Sparkline, Gauge), **Screenshots**         |
| **System**      | **Desktop Notifications**, **Encryption**, **Sound Alerts** |
| **Transports**  | Console, File (with rotation), Webhooks                     |

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
```

---

## Charts (v1.1)

Visualize data directly in your terminal.

### Bar Chart

```typescript
kai.chart([
  { label: "Users", value: 1500 },
  { label: "Sales", value: 890 },
  { label: "Errors", value: 32 },
]);
```

### Sparkline

```typescript
kai.sparkline([10, 25, 40, 35, 60, 90, 45, 20]);
// Output: ▂▃▄▃▅▇▄▂
```

### Gauge

```typescript
kai.gauge(75, 100, "CPU");
// CPU: [███████████████░░░░░] 75%
```

---

## Notifications & Sounds (v1.1)

### Desktop Notifications

Send native system notifications.

```typescript
kai.notify("Build complete!", "✅ Success");
```

### Sound Alerts

Play sounds for events. (Requires `src/sounds` folder or system sounds)

```typescript
// Configure sounds directory (optional)
kai.setSoundsDir("./src/sounds");

await kai.soundSuccess();
await kai.soundError();
kai.beep();
```

---

## Encryption (v1.1)

Handle sensitive data securely.

```typescript
// Mask sensitive info in logs
kai.masked("API Key", "sk-1234567890abcdef", 4);
// 🔒 API Key: ************cdef

// Encrypt/Decrypt helpers
const secret = kai.encrypted("My Secret Data", "my-key");
kai.decrypted(secret, "my-key");
```

---

## Screen Capture (v1.1)

Capture terminal output to file.

```typescript
kai.startCapture();

kai.success("This will be captured");
kai.info("So will this");

kai.saveScreenshot("logs/session.txt");
kai.saveScreenshotHtml("logs/session.html"); // Saves as styled HTML!
```

---

## Themes

```typescript
kai.setTheme("neon");
// Options: 'zen', 'neon', 'pastel', 'hacker', 'sunset', 'ocean'
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

## Performance Timer

```typescript
kai.time("query");
await db.query();
kai.timeEnd("query");
// ⏱ query: 145.32ms ⚡
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
