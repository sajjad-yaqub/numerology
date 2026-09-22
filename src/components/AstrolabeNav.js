/**
 * ASTRANUMERICS - SACRED ARTIFACT CHAMBER REEL NAVIGATION
 */

import { playChimeTap, playConfirmChime } from '../utils/soundEngine.js';

export function renderAstrolabeNav(containerId, activeTab, onTabSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const realms = [
    { id: 'reading', label: '1. CODEX', icon: '🔮' },
    { id: 'loshu', label: '2. MATRIX', icon: '📐' },
    { id: 'synastry', label: '3. SYNASTRY', icon: '💕' },
    { id: 'namelab', label: '4. NAME LAB', icon: '🧪' },
    { id: 'forecast', label: '5. DAILY VIBE', icon: '📅' },
    { id: 'address', label: '6. ADDRESS', icon: '🏠' },
    { id: 'vault', label: '7. VAULT', icon: '💾' }
  ];

  container.innerHTML = `
    <div class="astrolabe-dial-wrapper">
      <div class="astrolabe-ring-outer">
        <div class="astrolabe-ring-inner">
          <div class="astrolabe-center-core" title="Chamber Reel Selector">
            <span>[CHAMBER]</span>
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

  // Bind metallic sound triggers
  container.querySelectorAll('.astrolabe-node').forEach(node => {
    node.addEventListener('mouseenter', () => playChimeTap());

    node.addEventListener('click', () => {
      const tab = node.getAttribute('data-tab');

      playConfirmChime();

      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch(e) {}
      }

      if (tab) {
        onTabSelect(tab);
      }
    });
  });
}
