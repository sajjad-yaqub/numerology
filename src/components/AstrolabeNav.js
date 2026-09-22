/**
 * ASTRANUMERICS - SACRED ASTROLABE DIAL NAVIGATION COMPONENT
 */

import { playChime } from '../utils/soundEngine.js';

export function renderAstrolabeNav(containerId, activeTab, onTabSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const realms = [
    { id: 'reading', label: 'Core Reading', icon: '🔮', freq: 528 },
    { id: 'loshu', label: 'Lo Shu Matrix', icon: '📐', freq: 639 },
    { id: 'synastry', label: 'Synastry Match', icon: '💕', freq: 741 },
    { id: 'namelab', label: 'Name Lab', icon: '🧪', freq: 852 },
    { id: 'forecast', label: 'Daily Vibe', icon: '📅', freq: 432 },
    { id: 'address', label: 'Address & Phone', icon: '🏠', freq: 396 },
    { id: 'vault', label: 'Profile Vault', icon: '💾', freq: 963 }
  ];

  container.innerHTML = `
    <div class="astrolabe-dial-wrapper">
      <div class="astrolabe-ring-outer">
        <div class="astrolabe-ring-inner">
          <div class="astrolabe-center-core">
            <span class="core-symbol">✦</span>
          </div>

          ${realms.map((r) => {
            const isActive = r.id === activeTab;
            return `
              <button class="astrolabe-node ${isActive ? 'active' : ''}" data-tab="${r.id}" data-freq="${r.freq}" title="${r.label}">
                <span class="node-icon">${r.icon}</span>
                <span class="node-label">${r.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind click listeners & audio feedback
  container.querySelectorAll('.astrolabe-node').forEach(node => {
    node.addEventListener('click', () => {
      const tab = node.getAttribute('data-tab');
      const freq = parseInt(node.getAttribute('data-freq') || '528', 10);

      // Play audio chime
      playChime(freq);

      // Trigger haptic vibration if supported on mobile
      if (navigator.vibrate) {
        try { navigator.vibrate(15); } catch(e) {}
      }

      if (tab) {
        onTabSelect(tab);
      }
    });
  });
}
