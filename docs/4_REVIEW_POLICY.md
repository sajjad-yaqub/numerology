# Review Policy (`4_REVIEW_POLICY.md`)

## 1. Code Quality & Calculation Standards
- **Mathematical Accuracy**: All numerological reductions must pass strict unit testing. Master numbers (11, 22, 33) MUST NOT be prematurely reduced during Life Path or Expression calculation.
- **System Separation**: Pythagorean (1-9) vs. Chaldean (1-8) calculations must remain strictly isolated according to user settings.
- **PWA Integrity**: Service Worker (`sw.js`) and Web Manifest (`manifest.json`) edits must pass PWA offline validation checks.

## 2. Code Review Checklist
1. All core calculation functions must be pure functions with deterministic tests.
2. Zero external runtime dependencies in calculation logic.
3. Accessible UI elements with explicit ARIA labels and touch targets >= 48px.
4. Offline storage operations wrapped in `try/catch` with fallback handling.

---
*Assigned Lead Persona: 🛡️ Quality Assurance (QA)*
