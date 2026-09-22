/**
 * ASTRANUMERICS - COSMIC GAMIFICATION ENGINE
 * Tracks Cosmic XP, Mastery Ranks, Badges, and Toast Notifications.
 */

import { playChime } from './soundEngine.js';

const STORAGE_KEY = 'astranumerics_gamification';

const MASTERY_RANKS = [
  { level: 1, title: 'Neophyte Stargazer', minXp: 0, maxXp: 99, icon: '✨' },
  { level: 2, title: 'Mystic Initiate', minXp: 100, maxXp: 249, icon: '🔮' },
  { level: 3, title: 'Lo Shu Master', minXp: 250, maxXp: 499, icon: '📐' },
  { level: 4, title: 'Cosmic Alchemist', minXp: 500, maxXp: 999, icon: '🧪' },
  { level: 5, title: 'Sacred Archon', minXp: 1000, maxXp: 99999, icon: '👑' }
];

const BADGES = {
  first_reading: { id: 'first_reading', title: 'Stargazer Spark', desc: 'Completed your first core numerology reading', icon: '✨' },
  master_found: { id: 'master_found', title: 'Illuminated Soul', desc: 'Discovered a Master Number (11, 22, or 33) in your chart', icon: '🌟' },
  loshu_master: { id: 'loshu_master', title: 'Grid Archon', desc: 'Explored the sacred Lo Shu matrix planes & arrows', icon: '📐' },
  synastry_soul: { id: 'synastry_soul', title: 'Twin Flame Synastry', desc: 'Calculated relationship compatibility match', icon: '💕' },
  name_alchemist: { id: 'name_alchemist', title: 'Sound Transmuter', desc: 'Tested name variations in the Name Lab', icon: '🧪' },
  daily_oracle: { id: 'daily_oracle', title: 'Daily Devotee', desc: 'Spun the Daily Cosmic Oracle Wheel', icon: '🎡' }
};

let gameState = loadGameState();

function loadGameState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return {
    xp: 25,
    unlockedBadges: ['first_reading'],
    history: []
  };
}

function saveGameState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

export function getGameState() {
  return gameState;
}

export function getCurrentRank() {
  const xp = gameState.xp;
  for (let i = MASTERY_RANKS.length - 1; i >= 0; i--) {
    if (xp >= MASTERY_RANKS[i].minXp) {
      return MASTERY_RANKS[i];
    }
  }
  return MASTERY_RANKS[0];
}

export function addXP(amount, reason = '') {
  const prevRank = getCurrentRank();
  gameState.xp += amount;
  const newRank = getCurrentRank();

  saveGameState();
  playChime(852);

  showToast(`+${amount} Cosmic XP: ${reason}`, 'xp');

  if (newRank.level > prevRank.level) {
    playChime(963);
    showToast(`🎉 RANK UP! You are now a ${newRank.icon} ${newRank.title}!`, 'level');
  }

  updateGamificationUI();
}

export function unlockBadge(badgeId) {
  if (!BADGES[badgeId] || gameState.unlockedBadges.includes(badgeId)) return;

  gameState.unlockedBadges.push(badgeId);
  saveGameState();
  playChime(963);

  const b = BADGES[badgeId];
  showToast(`🏆 UNLOCKED BADGE: ${b.icon} ${b.title}!`, 'badge');
  addXP(50, `Unlocked ${b.title} Badge`);
}

export function getAllBadges() {
  return Object.keys(BADGES).map(key => ({
    ...BADGES[key],
    unlocked: gameState.unlockedBadges.includes(key)
  }));
}

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

export function updateGamificationUI() {
  const rank = getCurrentRank();
  const xp = gameState.xp;

  const rankTitleEl = document.getElementById('user-rank-title');
  const xpValueEl = document.getElementById('user-xp-value');
  const xpBarEl = document.getElementById('user-xp-bar');

  if (rankTitleEl) rankTitleEl.textContent = `${rank.icon} ${rank.title}`;
  if (xpValueEl) xpValueEl.textContent = `${xp} XP`;

  if (xpBarEl) {
    const range = rank.maxXp - rank.minXp;
    const progress = Math.min(100, Math.max(5, ((xp - rank.minXp) / range) * 100));
    xpBarEl.style.width = `${progress}%`;
  }
}
