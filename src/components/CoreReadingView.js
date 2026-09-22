/**
 * ASTRANUMERICS - ARCADE CORE READING RELIC CODEX VIEW
 */

import {
  calculateLifePath,
  calculateNameNumbers,
  calculateAttitudeNumber,
  calculateMaturityNumber
} from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS, KARMIC_DEBT_DETAILS } from '../data/numerologyData.js';
import { playBlipSound, playConfirmSound } from '../utils/soundEngine.js';

export function renderCoreReadingView(containerId, profile, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profile.name || !profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif text-yellow">ENTER PLAYER CREDENTIALS ABOVE</h2>
        <p class="text-secondary">Type full birth name and date of birth to reveal your Relic Codex.</p>
      </div>
    `;
    return;
  }

  const lifePath = calculateLifePath(profile.dob);
  const nameNums = calculateNameNumbers(profile.name, system);
  const attitude = calculateAttitudeNumber(profile.dob);
  const maturity = calculateMaturityNumber(lifePath.reduced, nameNums.expression.reduced);

  const cardsData = [
    {
      title: "Life Path Rank",
      tag: "PRIMARY CLASS",
      number: lifePath.reduced,
      meta: lifePath,
      interp: CORE_INTERPRETATIONS[lifePath.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Expression Destiny",
      tag: "SKILL SPECTRUM",
      number: nameNums.expression.reduced,
      meta: nameNums.expression,
      interp: CORE_INTERPRETATIONS[nameNums.expression.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Soul Urge Frequency",
      tag: "VOWEL AFFINITY",
      number: nameNums.soulUrge.reduced,
      meta: nameNums.soulUrge,
      interp: CORE_INTERPRETATIONS[nameNums.soulUrge.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Personality Shield",
      tag: "OUTER SHIELD",
      number: nameNums.personality.reduced,
      meta: nameNums.personality,
      interp: CORE_INTERPRETATIONS[nameNums.personality.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Attitude Sun Rank",
      tag: "FIRST REACTION",
      number: attitude.reduced,
      meta: attitude,
      interp: CORE_INTERPRETATIONS[attitude.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Maturity Power Rank",
      tag: "END-GAME UNLOCK",
      number: maturity.reduced,
      meta: maturity,
      interp: CORE_INTERPRETATIONS[maturity.reduced] || CORE_INTERPRETATIONS[1]
    }
  ];

  let html = `<div class="reading-grid">`;

  cardsData.forEach((card, idx) => {
    const isMaster = card.meta.isMaster;
    const debt = card.meta.karmicDebt;
    const statPct = Math.min(100, Math.max(20, (card.number / 9) * 100));

    html += `
      <div class="number-card" id="card-${idx}">
        <div class="card-header-badge">
          <span class="card-tag">${card.tag}</span>
          <div class="number-badge-glow ${isMaster ? 'master-badge-glow' : ''}">
            ${card.number}
          </div>
        </div>

        <h2 class="card-title">${card.title}</h2>
        <div class="card-archetype">${card.interp.archetype || ''} • ${card.interp.element || ''}</div>

        <p class="card-summary">${card.interp.summary}</p>

        <!-- HP / XP Progress Meter -->
        <div class="hp-meter-box">
          <div class="hp-meter-label">
            <span>RESONANCE METER</span>
            <span>${Math.round(statPct)}/100 HP</span>
          </div>
          <div class="hp-meter-track">
            <div class="hp-meter-fill" style="width: ${statPct}%;"></div>
          </div>
        </div>

        ${debt ? `
          <div class="arrow-item active-weakness mb-4">
            <strong>⚠️ BOSS DEBT WARNING: ${debt.name}</strong>
            <p style="font-size:0.85rem; margin-top:4px;">${KARMIC_DEBT_DETAILS[debt.debt]?.lesson || ''}</p>
          </div>
        ` : ''}

        <div class="card-details-accordion">
          <button class="accordion-toggle" data-target="acc-${idx}">
            <span>📜 SPELL BOOK & ADVICE</span>
            <span class="acc-icon">▼</span>
          </button>
          <div class="accordion-content" id="acc-${idx}">
            <div style="margin-bottom:8px;">
              <strong>Gemstone Relic:</strong> ${card.interp.gemstone || 'N/A'}<br>
              <strong>Tarot Card:</strong> ${card.interp.tarot || 'N/A'}
            </div>
            <strong>Special Traits:</strong>
            <div class="trait-list mb-4">
              ${(card.interp.strengths || []).map(s => `<span class="trait-pill">${s}</span>`).join('')}
            </div>
            <strong>Spiritual Strategy:</strong>
            <p style="font-style:italic; font-size:0.88rem; color: var(--accent-mustard-yellow); margin-top:4px;">
              "${card.interp.advice}"
            </p>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Bind accordion toggles & sound triggers
  container.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('mouseenter', () => playBlipSound());
    btn.addEventListener('click', () => {
      playConfirmSound();
      const targetId = btn.getAttribute('data-target');
      const content = container.querySelector(`#${targetId}`);
      const icon = btn.querySelector('.acc-icon');
      if (content) {
        const isOpen = content.classList.contains('open');
        content.classList.toggle('open');
        icon.textContent = isOpen ? '▼' : '▲';
      }
    });
  });
}
