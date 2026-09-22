# Design System (`3_DESIGN_SYSTEM.md`) - Sacred Geometry Arcade HUD

## 1. Aesthetic Vision: Sacred Geometry Artifact Console

An ancient Sacred Geometry Arcade HUD interface ("RITUAL CHAMBER"). Blends an ancient carved artifact with a retro game console. Utilizes warm parchment/bone backgrounds (`#EDE6D6`), antique brass (`#9C6B1F`), oxblood red (`#7A2530`), near-black charcoal (`#211D18`), coin/medallion numerical badges, 3px solid charcoal outlines, offset pressed shadows (`box-shadow: 4px 4px 0px #211D18`), carved display serif typography (*Cinzel*), metallic chime sound cues, filling engraved calculation meters, and zero soft-UI or glassmorphism.

## 2. Color Palette Tokens (Committed Palette)

```css
:root {
  /* Sacred Artifact Color Palette */
  --bg-parchment: #ede6d6;
  --bg-card-parchment: #f5efe1;
  --bg-input-parchment: #e2d9c6;
  --bg-dark-charcoal: #211d18;

  --accent-brass: #9c6b1f;
  --accent-brass-light: #c48c33;
  --accent-oxblood: #7a2530;
  --accent-slate-green: #5c6e5a;

  --border-charcoal: #211d18;
  --border-width: 3px;

  --shadow-offset: 4px 4px 0px #211d18;
  --shadow-pressed: 0px 0px 0px #211d18;

  --text-charcoal: #211d18;
  --text-secondary: #5c5549;
  --text-brass: #9c6b1f;
  --text-oxblood: #7a2530;
  --text-parchment: #ede6d6;

  /* Typography */
  --font-serif-carved: 'Cinzel', serif;
  --font-header: 'Chakra Petch', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'Share Tech Mono', monospace;

  --touch-target-min: 44px;
}
```

## 3. Strict Anti-Patterns (Forbidden)
- ❌ No purple/violet anywhere.
- ❌ No glassmorphism / frosted blur panels (`backdrop-filter` deleted).
- ❌ No soft, evenly rounded corners on every element.
- ❌ No generic "spiritual app" gradients (sunset pastels, aura-style blends).
- ❌ No literal mystical clip-art (stars, moons, tarot illustrations).
- ❌ No Inter, Roboto, or system-default fonts for headers.
- ❌ No plain opacity cross-fades for primary screen navigation.
- ❌ No pure white cards on white/near-white backgrounds.
- ❌ No fixed-pixel layouts that break or overlap on smaller/larger screens.

---
*Assigned Lead Persona: 🎨 UI/UX Designer*
