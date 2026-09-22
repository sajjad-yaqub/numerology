/**
 * ASTRANUMERICS - GAMIFICATION BANNER & BADGE DRAWER COMPONENT
 */

import { getCurrentRank, getGameState, getAllBadges } from '../utils/gamificationEngine.js';

export function renderGamificationBanner(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const rank = getCurrentRank();
  const state = getGameState();
  const badges = getAllBadges();

  const range = rank.maxXp - rank.minXp;
  const progress = Math.min(100, Math.max(5, ((state.xp - rank.minXp) / range) * 100));

  container.innerHTML = `
    <div class="xp-rank-pill" id="open-badges-btn" title="View Mastery Rank & Badges">
      <div class="rank-info">
        <span id="user-rank-title" class="rank-title">${rank.icon} ${rank.title}</span>
        <span id="user-xp-value" class="xp-val">${state.xp} XP</span>
      </div>
      <div class="xp-track">
        <div id="user-xp-bar" class="xp-fill" style="width:${progress}%;"></div>
      </div>
    </div>

    <!-- Badge Drawer Modal -->
    <div id="badge-modal" class="badge-modal hidden">
      <div class="badge-modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2 class="font-serif text-gold">🏆 Collectible Cosmic Badges</h2>
          <button id="close-badge-modal" class="btn-ghost btn-sm">✕</button>
        </div>

        <div class="badge-grid">
          ${badges.map(b => `
            <div class="badge-card ${b.unlocked ? 'unlocked' : 'locked'}">
              <span class="badge-icon">${b.icon}</span>
              <strong class="badge-title">${b.title}</strong>
              <span class="badge-desc">${b.desc}</span>
              <span class="badge-status-tag">${b.unlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const openBtn = container.querySelector('#open-badges-btn');
  const modal = container.querySelector('#badge-modal');
  const closeBtn = container.querySelector('#close-badge-modal');

  openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
}
