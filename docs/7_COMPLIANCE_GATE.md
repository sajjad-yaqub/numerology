# Compliance Gate (`7_COMPLIANCE_GATE.md`)

## Pre-Flight Compliance Checklist

Before releasing or delivering changes, the codebase must pass all 5 gates below:

- [ ] **Gate 1: PWA Readiness**
  - Web App Manifest `public/manifest.json` is valid.
  - Service Worker `public/sw.js` registers successfully without scope errors.
  - Offline mode tested and functioning.

- [ ] **Gate 2: Calculation Verification**
  - Pythagorean engine verified for core numbers & master numbers (11, 22, 33).
  - Chaldean engine verified for ancient Babylonian letter-number mapping.
  - Karmic Debt numbers (13/4, 14/5, 16/7, 19/1) correctly identified.

- [ ] **Gate 3: Mobile Touch UI (Design System)**
  - Touch targets minimum 48px height/width.
  - Glassmorphic Obsidian visual design correctly rendered across screen sizes.

- [ ] **Gate 4: Privacy & Zero Remote Data Leak**
  - Zero telemetry or remote data posting detected.
  - Profile vault saves and loads cleanly from local storage.

- [ ] **Gate 5: Build Verification**
  - Vite `npm run build` completes cleanly with zero errors.

---
*Assigned Lead Persona: 🛡️ Quality Assurance (QA)*
