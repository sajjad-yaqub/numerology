/**
 * ASTRANUMERICS - DAILY COSMIC ORACLE WHEEL MINI-GAME
 */

import { addXP, unlockBadge } from '../utils/gamificationEngine.js';
import { playChime } from '../utils/soundEngine.js';

export function renderOracleWheelGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sectors = [
    { label: '🌟 Crown', xp: 40, theme: 'High Intuition & Divine Clarity', color: '#ffe596' },
    { label: '💎 Abundance', xp: 30, theme: 'Material Growth & Opportunity', color: '#f3ce6d' },
    { label: '🔮 Truth', xp: 50, theme: 'Unlocking Hidden Sacred Wisdom', color: '#c77dff' },
    { label: '💕 Harmony', xp: 35, theme: 'Heart Synastry & Connection', color: '#f72585' },
    { label: '⚡ Spark', xp: 25, theme: 'Alchemical Creative Inspiration', color: '#4cc9f0' },
    { label: '🛡️ Shield', xp: 30, theme: 'Aura Protection & Inner Strength', color: '#06d6a0' },
    { label: '☀️ Solar', xp: 45, theme: 'Executive Power & Courage', color: '#ff9e00' },
    { label: '🌙 Lunar', xp: 35, theme: 'Subconscious Dream Insight', color: '#9d4edd' }
  ];

  container.innerHTML = `
    <div class="hero-section" style="text-align:center; padding: 28px 20px;">
      <span class="card-tag">Interactive Daily Mini-Game</span>
      <h2 class="font-serif text-gold" style="margin-top:8px;">🔮 Cosmic Oracle Wheel</h2>
      <p class="text-secondary" style="font-size:0.9rem; margin-bottom:20px;">
        Spin the sacred wheel once per day to unlock your daily cosmic vibration & earn +XP.
      </p>

      <div class="oracle-wheel-wrapper">
        <div class="oracle-wheel-pointer">▼</div>
        <canvas id="oracle-wheel-canvas" width="300" height="300"></canvas>
      </div>

      <div style="margin-top:20px;">
        <button id="spin-wheel-btn" class="btn-primary">
          <span>🎡 Spin Cosmic Wheel</span>
        </button>
      </div>

      <div id="oracle-result-box" class="mt-4" style="display:none;"></div>
    </div>
  `;

  const canvas = container.querySelector('#oracle-wheel-canvas');
  const ctx = canvas.getContext('2d');
  const spinBtn = container.querySelector('#spin-wheel-btn');
  const resultBox = container.querySelector('#oracle-result-box');

  let currentAngle = 0;
  let isSpinning = false;

  function drawWheel() {
    const numSectors = sectors.length;
    const arc = (Math.PI * 2) / numSectors;
    const cx = 150;
    const cy = 150;
    const radius = 140;

    ctx.clearRect(0, 0, 300, 300);

    for (let i = 0; i < numSectors; i++) {
      const angle = currentAngle + i * arc;

      // Draw Sector Fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.fillStyle = i % 2 === 0 ? 'rgba(15, 18, 30, 0.95)' : 'rgba(24, 30, 50, 0.95)';
      ctx.fill();

      // Draw Golden Sector Border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Sector Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = sectors[i].color;
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillText(sectors[i].label, radius - 15, 4);
      ctx.restore();
    }

    // Outer & Inner Concentric Rings
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#f3ce6d';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#050608';
    ctx.fill();
    ctx.strokeStyle = '#f3ce6d';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#f3ce6d';
    ctx.font = 'bold 16px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦', cx, cy + 5);
  }

  drawWheel();

  spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.style.opacity = '0.5';

    const extraRounds = 5 + Math.floor(Math.random() * 4);
    const targetSectorIdx = Math.floor(Math.random() * sectors.length);
    const arc = (Math.PI * 2) / sectors.length;

    // Calculate target angle pointing to top pointer (270 degrees / -PI/2)
    const targetAngle = (Math.PI * 2 * extraRounds) + ((sectors.length - targetSectorIdx) * arc) - (arc / 2) - (Math.PI / 2);

    let start = null;
    const duration = 4000;

    function animateSpin(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      currentAngle = easeProgress * targetAngle;

      drawWheel();

      if (Math.random() > 0.8) {
        playChime(600 + Math.random() * 300);
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.style.opacity = '1';

        const won = sectors[targetSectorIdx];
        addXP(won.xp, `Oracle Wheel: ${won.label}`);
        unlockBadge('daily_oracle');

        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <div class="number-card" style="border-color:${won.color}; box-shadow:0 0 25px ${won.color}44;">
            <span class="card-tag" style="color:${won.color}; border-color:${won.color};">Daily Oracle Alignment</span>
            <h3 class="font-serif" style="color:${won.color}; margin-top:8px;">${won.label} (+${won.xp} XP)</h3>
            <p class="card-summary" style="margin-top:6px;">${won.theme}</p>
          </div>
        `;
      }
    }

    requestAnimationFrame(animateSpin);
  });
}
