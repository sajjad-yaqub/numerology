# System Architecture (`2_ARCHITECTURE.md`)

## 1. Architectural Strategy: Offline-First PWA

```
[ User Browser / Installed PWA ]
        │
        ├── [ Service Worker (sw.js) ] <──> [ Cache Storage (Assets, Shell, Data) ]
        │
        ├── [ State & Vault Manager ]  <──> [ LocalStorage / IndexedDB ]
        │
        ├── [ Numerology Engine ] ───────> Pure JS Calculation Algorithms
        │
        └── [ UI Render Engine ] ────────> Component-Driven DOM Engine (Vanilla / Modular JS)
```

## 2. Core Modules Architecture

1. **`sw.js` (Service Worker)**:
   - Cache-first strategy for static assets (CSS, JS, Fonts, Images).
   - Network-first with offline fallback for any external resources.
   - Immediate activation and client claim cycle (`skipWaiting()`, `clients.claim()`).

2. **`numerologyEngine.js` (Calculation Core)**:
   - Pure, deterministic functional module without side effects.
   - Zero external runtime dependencies for maximum calculation speed and offline integrity.
   - Standardized numeric reduction helper with master number immunity (11, 22, 33).

3. **`ProfileVault` (Persistence Layer)**:
   - Encapsulated CRUD wrapper over `window.localStorage`.
   - JSON serialization with schema validation and fallback defaults.
   - Export/Import JSON format for cross-device backup.

4. **UI Component Architecture**:
   - Event-driven reactive UI updates.
   - Centralized App State holding: `activeProfile`, `calculationSystem` (Pythagorean|Chaldean), `currentTab`, `savedProfiles`.

---
*Assigned Lead Persona: 🏗️ Engineering Manager (EM)*
