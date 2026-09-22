# Design System (`3_DESIGN_SYSTEM.md`) - Arcade Cabinet Retro-Futurist

## 1. Aesthetic Vision: Option 2 — Arcade Cabinet

A high-octane, retro-futurist arcade game interface. Reads like a coin-op game menu ("SELECT STAGE", "VERSUS MODE", "PLAYER CODEX"). Utilizes flat color fills, chunky 3px solid black outlines, offset pressed shadows (`box-shadow: 4px 4px 0px #000`), arcade display typography (*VT323* & *Chakra Petch*), 8-bit chiptune sound cues, HP/XP style progress meters, and zero soft-UI or glassmorphism.

## 2. Color System Tokens (Committed to Option 2)

```css
:root {
  /* Arcade Cabinet Colors */
  --bg-navy-black: #12121a;
  --bg-card-arcade: #1b1b26;
  --bg-input-arcade: #0d0d14;

  --accent-hot-coral: #ff3b3b;
  --accent-mustard-yellow: #f2c230;
  --accent-electric-cyan: #00f0ff;
  --accent-lime-green: #39ff6a;

  --border-arcade-black: #000000;
  --border-arcade-width: 3px;

  --shadow-pressed-offset: 4px 4px 0px #000000;
  --shadow-pressed-active: 0px 0px 0px #000000;

  --text-primary: #ffffff;
  --text-secondary: #a0a0b8;
  --text-yellow: #f2c230;
  --text-coral: #ff3b3b;
  --text-cyan: #00f0ff;

  /* Typography */
  --font-arcade-display: 'VT323', monospace;
  --font-header: 'Chakra Petch', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;

  --touch-target-min: 48px;
}
```

## 3. Strict Anti-Patterns (Forbidden)
- ❌ No purple/violet as primary color.
- ❌ No glassmorphism / frosted blur panels (`backdrop-filter` deleted).
- ❌ No soft, evenly rounded corners on every element (mix sharp + offset hard cut corners).
- ❌ No generic AI product gradient backgrounds (flat color blocks or hard 2-tone fills only).
- ❌ No Inter, Roboto, or system-default fonts for headers.
- ❌ No plain opacity cross-fades for primary screen navigation.

---
*Assigned Lead Persona: 🎨 UI/UX Designer*
