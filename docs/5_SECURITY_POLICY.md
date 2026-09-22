# Security Policy (`5_SECURITY_POLICY.md`)

## 1. Zero-Knowledge Client-Side Architecture
- **Data Privacy**: All user profile entries (names, dates of birth, notes) are stored strictly inside the local device storage (`window.localStorage` / `IndexedDB`).
- **No Remote Transmission**: Personal reading data is NEVER uploaded to external servers or third-party telemetry analytics.
- **Offline Shielding**: Application operates fully without network connectivity once installed.

## 2. Input Sanitization & Storage Safety
- XSS prevention: All dynamic text injected into DOM must be safely escaped or constructed using standard text content nodes.
- LocalStorage export sanitization: Profile JSON exports must be validated against schema before import to prevent injection attacks.

---
*Assigned Lead Persona: 🏗️ Engineering Manager (EM)*
