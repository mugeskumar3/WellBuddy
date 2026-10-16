# WellBuddy — Desktop Wellness Companion

WellBuddy is a modern, privacy-first desktop wellness companion built for Windows 10 and 11. It provides independent background scheduling for hydration, posture, vision health, and stretching, paired with an interactive floating desktop companion, system tray integration, native notifications, and persistent local storage.

---

## 🌟 Core Features

- **Independent Wellness Reminders**:
  - **Hydration Break**: Configurable intervals with water logging suggestions.
  - **Stand & Move**: Posture alignment prompts to combat prolonged sitting.
  - **20-20-20 Vision Rest**: Guided 20-second countdown break looking 20 feet away to alleviate digital eye strain.
  - **Desk Stretching**: Curated library of 5 guided desk stretches with step-by-step instructions and timers.
- **Durable Scheduling & Idempotency**:
  - Each reminder type calculates its due time independently without resetting others.
  - Occurrences are identified deterministically (`{type}_{scheduledTimestamp}`).
  - Done, Snooze, and Skip state machine prevents duplicate alerts.
  - Anti-storm pacing ensures reminders due simultaneously are gracefully spaced.
  - Overdue recovery policy prevents notification floods when waking from sleep.
  - Working hours (customizable start/end times and active days) and Quiet hours.
- **Floating Companion**:
  - Frameless, transparent, always-on-top window with smooth drag-and-drop.
  - Screen boundary constraint protection.
  - Speech bubble prompts with quick **Done**, **Snooze (5m)**, and **Skip** action buttons.
  - Mascot interactions and cheer quotes.
  - Can be shown, hidden, or resized without interrupting background reminders.
- **Avatar System**:
  - **4 Built-in Mascots**: Aqua the Droplet, Sprout the Seedling, Bolt the RoboBuddy, and Zen the Pebble.
  - **Custom Avatar Uploads**: Secure validation of PNG, JPG, and WebP files up to 5MB with magic-byte verification, stored locally in the application user data directory.
- **Water Intake Tracker**:
  - Daily customizable hydration targets (e.g., 2,000 ml).
  - Quick-log buttons (+150ml, +250ml, +350ml, +500ml, and custom input).
  - Daily history log with timestamps and delete/undo support.
  - 7-day intake history chart.
- **Windows System Tray & Startup Integration**:
  - Dedicated system tray icon with dynamic context menu (Open Dashboard, Toggle Companion, Pause/Resume, Upcoming reminder status, Exit).
  - Minimize-to-tray lifecycle: closing the dashboard keeps reminders running in the tray.
  - Windows startup (`openAtLogin`) integration enabled by default on initial run, with persistent user toggle.
- **100% Local & Private**:
  - Embedded SQLite database with versioned migrations.
  - Zero telemetry, zero analytics, zero external network dependencies.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Desktop Shell** | Electron 44, Node.js runtime, native Windows Notifications, Tray API |
| **Frontend UI** | React 19, TypeScript (strict mode), Tailwind CSS, Lucide React |
| **Bundler & Build** | Vite, PostCSS, TypeScript Compiler |
| **Persistence** | SQLite (`better-sqlite3` and built-in `node:sqlite` fallback) with versioned migrations |
| **Validation** | Zod runtime schema validation across IPC boundaries |
| **Testing** | Vitest, React Testing Library, `@testing-library/jest-dom`, JSDOM |
| **Packaging** | Electron Builder (NSIS installer & portable Windows builds) |

---

## 📁 Project Structure

```text
WellBuddy/
├── electron/
│   ├── main.ts                    # Main process lifecycle, CSP, single-instance lock
│   ├── preload.ts                 # Secure contextBridge API mapping
│   ├── engine/
│   │   ├── scheduler.ts           # Core reminder scheduling engine & idempotency
│   │   ├── time-utils.ts          # Working hours & quiet hours schedule logic
│   │   └── content-catalog.ts     # Tips, stretch instructions, and reminder copy
│   ├── windows/
│   │   ├── dashboard-window.ts    # Main dashboard window with minimize-to-tray
│   │   └── companion-window.ts    # Transparent frameless draggable companion window
│   ├── tray/
│   │   └── tray-manager.ts        # System tray icon and dynamic context menu
│   ├── notifications/
│   │   └── notification-manager.ts# Windows desktop toast notification manager
│   ├── startup/
│   │   └── startup-manager.ts     # Windows login item (openAtLogin) integration
│   ├── avatars/
│   │   └── avatar-manager.ts      # Avatar scanning, upload validation, and disk storage
│   └── ipc/
│       └── handlers.ts            # Validated IPC handlers
├── src/
│   ├── main.tsx                   # React root router (Dashboard vs Companion)
│   ├── components/
│   │   ├── DashboardApp.tsx       # Main dashboard layout, navigation, and header
│   │   └── CompanionApp.tsx       # Draggable floating companion view
│   ├── features/
│   │   ├── dashboard/             # Overview metrics, next reminder, habit score
│   │   ├── water/                 # Hydration progress, quick-add, 7-day chart
│   │   ├── reminders/             # Independent settings for all 4 reminder types
│   │   ├── wellness/              # 20-20-20 eye rest timer & guided desk stretches
│   │   ├── avatars/               # Mascot selection, custom upload & size controls
│   │   └── settings/              # Themes, startup toggle, sound, privacy info
│   ├── services/
│   │   └── api.ts                 # Typed window.wellBuddyAPI bridge with test mocks
│   └── styles/
│       └── index.css              # Global styles, Tailwind directives, drag regions
├── shared/
│   ├── types.ts                   # Domain models and IPC contracts
│   ├── validation.ts              # Zod validation schemas
│   └── built-in-avatars.ts        # Embedded SVG mascot definitions
├── database/
│   ├── connection.ts              # SQLite adapter (better-sqlite3 & node:sqlite)
│   ├── migrator.ts                # Transactional migration runner
│   ├── migrations/                # Versioned SQL migrations (001_initial_schema)
│   └── repositories/              # Repository pattern for settings, occurrences, water, logs, prefs
├── tests/
│   ├── unit/                      # Database, scheduler, validation, avatars, UI tests
│   └── integration/               # Persistence across restarts & desktop behaviors
├── electron-builder.json          # Windows packaging configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ (v22 or v24 recommended)
- **npm**: v10+
- **OS**: Windows 10 or Windows 11

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/WellBuddy.git
cd WellBuddy

# Install dependencies
npm install
```

### Running in Development
```bash
# Build the electron and renderer bundles
npm run build

# Start the application
npm start
```

### Running Tests
WellBuddy includes a comprehensive automated test suite (33 unit, integration, and UI tests):
```bash
# Run all automated tests
npm test
```

### Packaging for Windows
```bash
# Build production bundle and package Windows executable
npm run dist
```
The installer will be placed in the `release/` directory.

---

## 🔒 Security & Reliability Architecture

- **Context Isolation & Sandbox**: Electron windows operate with `contextIsolation: true` and `nodeIntegration: false`.
- **Preload Boundary**: Only typed, narrowly scoped APIs are exposed to the renderer via `contextBridge`.
- **Zod Schema Validation**: All IPC payloads sent from the frontend are validated on the main process side before touching repositories or disk.
- **Content Security Policy**: Restrictive CSP applied to web contents preventing execution of unauthorized remote scripts.
- **Safe File Storage**: Uploaded custom avatars are checked for file size (max 5MB), image MIME types, and binary magic bytes (PNG, JPEG, WebP) to prevent arbitrary file upload vulnerabilities.
- **Persistent Storage**: SQLite database and avatars are stored in Electron's standard user data folder (`%APPDATA%\WellBuddy`), never inside the program files or source directory.

---

## 📄 License
MIT License. Built with ❤️ for healthy desk habits.
