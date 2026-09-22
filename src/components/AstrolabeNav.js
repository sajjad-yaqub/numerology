/**
 * ASTRANUMERICS - CYBERPUNK HUD COMMAND WHEEL NAVIGATION
 */

import { playHoverSound, playClickSound } from '../utils/soundEngine.js';

export function renderAstrolabeNav(containerId, activeTab, onTabSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const realms = [
    { id: 'reading', label: 'CORE_READING', icon: '🔮' },
    { id: 'loshu', label: 'LOSHU_MATRIX', icon: '📐' },
    { id: 'synastry', label: 'SYNASTRY_RADAR', icon: '💕' },
    { id: 'namelab', label: 'NAME_LAB', icon: '🧪' },
    { id: 'forecast', label: 'DAILY_VIBE', icon: '📅' },
    { id: 'address', label: 'ADDRESS_FREQ', icon: '🏠' },
    { id: 'vault', label: 'CODEX_VAULT', icon: '💾' }
  ];

  container.innerHTML = `
    <div class="astrolabe-dial-wrapper">
      <div class="astrolabe-ring-outer">
        <div class="astrolabe-ring-inner">
          <div class="astrolabe-center-core" title="Cyberpunk Command Core">
            <span>[SYS]</span>
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

  // Bind hover & click SFX listeners
  container.querySelectorAll('.astrolabe-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      playHoverSound();
    });

    node.addEventListener('click', () => {
      const tab = node.getAttribute('data-tab');

      playClickSound();

      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch(e) {}
      }

      if (tab) {
        onTabSelect(tab);
      }
    });
  });
}
