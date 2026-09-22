/**
 * ASTRANUMERICS - ARCADE COMMAND REEL / STAGE SELECTOR NAVIGATION
 */

import { playBlipSound, playConfirmSound } from '../utils/soundEngine.js';

export function renderAstrolabeNav(containerId, activeTab, onTabSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const realms = [
    { id: 'reading', label: 'STAGE 1: CODEX', icon: '🔮' },
    { id: 'loshu', label: 'STAGE 2: MATRIX', icon: '📐' },
    { id: 'synastry', label: 'STAGE 3: VS MATCH', icon: '💕' },
    { id: 'namelab', label: 'STAGE 4: NAME LAB', icon: '🧪' },
    { id: 'forecast', label: 'STAGE 5: VIBE CYCLE', icon: '📅' },
    { id: 'address', label: 'STAGE 6: ADDRESS', icon: '🏠' },
    { id: 'vault', label: 'STAGE 7: SAVE VAULT', icon: '💾' }
  ];

  container.innerHTML = `
    <div class="astrolabe-dial-wrapper">
      <div class="astrolabe-ring-outer">
        <div class="astrolabe-ring-inner">
          <div class="astrolabe-center-core" title="Arcade Stage Selector">
            <span>[STAGE]</span>
          </div>

          ${realms.map((r) => {
            const isActive = r.id === activeTab;
            return `
              <button class="astrolabe-node ${isActive ? 'active' : ''}" data-tab="${r.id}" title="${r.label}">
                <span class="node-icon">${r.icon}</span>
                <span class="node-label">${r.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind 8-Bit hover & click sound triggers
  container.querySelectorAll('.astrolabe-node').forEach(node => {
    node.addEventListener('mouseenter', () => playBlipSound());

    node.addEventListener('click', () => {
      const tab = node.getAttribute('data-tab');

      playConfirmSound();

      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch(e) {}
      }

      if (tab) {
        onTabSelect(tab);
      }
    });
  });
}
