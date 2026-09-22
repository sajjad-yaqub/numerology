/**
 * ASTRANUMERICS - ARCADE CABINET NAVBAR COMPONENT
 */

import { toggleAudio, getAudioState, playConfirmSound, playBlipSound } from '../utils/soundEngine.js';

export function renderNavbar(containerId, activeSystem, onSystemChange, savedCount, onOpenVault) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isAudioActive = getAudioState();

  container.innerHTML = `
    <a href="#" class="header-brand" title="AstraNumerics Arcade">
      <img src="/icons/icon.svg" alt="AstraNumerics" class="brand-icon" />
      <span class="brand-title">ASTRANUMERICS</span>
    </a>

    <div class="header-actions">
      <!-- Arcade Coin-Op Credit Badge -->
      <div class="sys-status-badge" title="Coin-Op Arcade Mode">
        <span class="status-dot"></span>
        <span>CREDITS: 99</span>
      </div>

      <!-- 8-Bit Audio SFX Toggler -->
      <button id="nav-audio-btn" class="audio-toggle-btn ${isAudioActive ? 'active' : ''}" title="Toggle 8-Bit Sound FX">
        <span>${isAudioActive ? '🔊 8-BIT SOUND' : '🔇 SOUND OFF'}</span>
      </button>

      <!-- System Selector Toggle -->
      <div class="system-toggle" title="Switch Calculation Engine">
        <button class="system-btn ${activeSystem === 'pythagorean' ? 'active' : ''}" data-system="pythagorean">Pythagorean</button>
        <button class="system-btn ${activeSystem === 'chaldean' ? 'active' : ''}" data-system="chaldean">Chaldean</button>
      </div>

      <!-- Vault Quick Launcher -->
      <button id="nav-vault-btn" class="btn-ghost btn-sm" title="Saved Profiles Codex">
        💾 <span class="vault-badge-count">${savedCount}</span>
      </button>
    </div>
  `;

  // Bind Audio toggle
  const audioBtn = container.querySelector('#nav-audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('mouseenter', () => playBlipSound());
    audioBtn.addEventListener('click', () => {
      const active = toggleAudio();
      audioBtn.classList.toggle('active', active);
      audioBtn.querySelector('span').textContent = active ? '🔊 8-BIT SOUND' : '🔇 SOUND OFF';
    });
  }

  // Bind system switcher
  container.querySelectorAll('.system-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playBlipSound());
    btn.addEventListener('click', (e) => {
      playConfirmSound();
      const system = e.target.getAttribute('data-system');
      if (system && system !== activeSystem) {
        onSystemChange(system);
      }
    });
  });

  // Bind vault launcher
  const vaultBtn = container.querySelector('#nav-vault-btn');
  if (vaultBtn) {
    vaultBtn.addEventListener('mouseenter', () => playBlipSound());
    vaultBtn.addEventListener('click', () => {
      playConfirmSound();
      onOpenVault();
    });
  }
}
