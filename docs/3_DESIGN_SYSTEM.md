# Design System (`3_DESIGN_SYSTEM.md`) - Cyberpunk / Destiny 2 HUD

## 1. Aesthetic Vision: Tactical Cyber-HUD

A high-tech, responsive video game interface inspired by *Destiny 2* and *Cyberpunk 2077*. Features chamfered cut-corner geometry, HUD bracket reticles `[ ]`, tactical metadata subtext (`SYS_VER 1.0.4`, `CORE_NODE // LP_07`), exotic gear rarity borders, and responsive mobile/tablet layout.

## 2. Color Palette & Cyberpunk Tokens

```css
:root {
  /* Tactical Void Palette */
  --bg-obsidian: #050608;
  --bg-deep-space: #0a0c14;
  --bg-card-hud: rgba(12, 15, 26, 0.85);
  --bg-card-hud-hover: rgba(20, 26, 44, 0.92);
  --bg-glass-input: rgba(8, 10, 18, 0.9);

  /* Cyber Bioluminescent Accents */
  --accent-cyber-gold: #f3ce6d;
  --accent-cyber-gold-bright: #ffe596;
  --accent-neon-cyan: #00f0ff;
  --accent-exotic-amethyst: #9d4edd;
  --accent-rare-emerald: #06d6a0;
  --accent-warning-rose: #ff0055;
  --accent-starlight: #e2e8ff;

  --border-hud-cyan: rgba(0, 240, 255, 0.35);
  --border-hud-gold: rgba(243, 206, 109, 0.4);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-gold: #f3ce6d;
  --text-cyan: #00f0ff;

  /* Typography */
  --font-serif: 'Cinzel', serif;
  --font-sans: 'Outfit', sans-serif;
  --font-mono: 'Courier New', monospace;

  /* Geometry & Chamfer Clip Paths */
  --clip-chamfer-lg: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  --clip-chamfer-md: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  --clip-chamfer-sm: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));

  --shadow-hud-gold: 0 0 25px rgba(243, 206, 109, 0.25);
  --shadow-hud-cyan: 0 0 25px rgba(0, 240, 255, 0.25);

  --touch-target-min: 48px;
}
```

## 3. Responsive Game Layout Architecture
- **Desktop (>1024px)**: 3-column HUD layout (Left Player Codex, Central Active Display, Right Inspector).
- **Tablet (600px - 1024px)**: 2-column HUD layout with collapsible inspector drawers.
- **Mobile (<600px)**: 1-column touch-optimized game HUD with bottom Command Wheel navigation.

---
*Assigned Lead Persona: 🎨 UI/UX Designer*
