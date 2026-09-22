# Operations Runbook (`6_OPERATIONS_RUNBOOK.md`)

## 1. PWA Service Worker Update Protocol
1. Increment cache version inside `public/sw.js` (e.g., `const CACHE_NAME = 'astranumerics-v1.0.1'`).
2. Deploy assets.
3. The new Service Worker will automatically trigger `install` and `activate` hooks, purging stale caches upon user reload.

## 2. Local Storage Recovery & Backups
- If local storage becomes corrupted: Users can navigate to Settings -> Profile Vault -> "Export Backup" to save a JSON file, or "Reset Storage" to restore clean defaults.

## 3. Rollback Commands & Build Verification
```bash
# Verify build integrity locally
npm run build
npm run preview
```

---
*Assigned Lead Persona: 🏗️ Engineering Manager (EM)*
