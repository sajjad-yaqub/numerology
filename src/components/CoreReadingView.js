/**
 * ASTRANUMERICS - CORE READING VIEW COMPONENT
 */

import {
  calculateLifePath,
  calculateNameNumbers,
  calculateAttitudeNumber,
  calculateMaturityNumber
} from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS, KARMIC_DEBT_DETAILS } from '../data/numerologyData.js';

export function renderCoreReadingView(containerId, profile, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profile.name || !profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif text-gold">Awaiting Sacred Credentials</h2>
        <p class="text-muted">Enter your name and date of birth above to unlock your core chart.</p>
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
      title: "Life Path Number",
      tag: "Primary Life Purpose",
      number: lifePath.reduced,
      meta: lifePath,
      interp: CORE_INTERPRETATIONS[lifePath.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Expression (Destiny) Number",
      tag: "Natural Talents & Potential",
      number: nameNums.expression.reduced,
      meta: nameNums.expression,
      interp: CORE_INTERPRETATIONS[nameNums.expression.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Soul Urge (Heart's Desire)",
      tag: "Inner Vowel Frequency",
      number: nameNums.soulUrge.reduced,
      meta: nameNums.soulUrge,
      interp: CORE_INTERPRETATIONS[nameNums.soulUrge.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Personality Number",
      tag: "Outer Aura & Impression",
      number: nameNums.personality.reduced,
      meta: nameNums.personality,
      interp: CORE_INTERPRETATIONS[nameNums.personality.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Attitude (Sun) Number",
      tag: "First Reaction & Day-to-Day",
      number: attitude.reduced,
      meta: attitude,
      interp: CORE_INTERPRETATIONS[attitude.reduced] || CORE_INTERPRETATIONS[1]
    },
    {
      title: "Maturity (Power) Number",
      tag: "Second Half of Life Purpose",
      number: maturity.reduced,
      meta: maturity,
      interp: CORE_INTERPRETATIONS[maturity.reduced] || CORE_INTERPRETATIONS[1]
    }
  ];

  let html = `<div class="reading-grid">`;

  cardsData.forEach((card, idx) => {
    const isMaster = card.meta.isMaster;
    const debt = card.meta.karmicDebt;

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

        ${debt ? `
          <div class="arrow-item active-weakness mb-4">
            <strong>⚠️ ${debt.name}</strong>
            <p style="font-size:0.8rem; margin-top:4px;">${KARMIC_DEBT_DETAILS[debt.debt]?.lesson || ''}</p>
          </div>
        ` : ''}

        <div class="card-details-accordion">
          <button class="accordion-toggle" data-target="acc-${idx}">
            <span>✨ Deep Insights & Guidance</span>
            <span class="acc-icon">▼</span>
          </button>
          <div class="accordion-content" id="acc-${idx}">
            <div style="margin-bottom:8px;">
              <strong>Gemstone:</strong> ${card.interp.gemstone || 'N/A'}<br>
              <strong>Tarot Archetype:</strong> ${card.interp.tarot || 'N/A'}
            </div>
            <strong>Core Strengths:</strong>
            <div class="trait-list mb-4">
              ${(card.interp.strengths || []).map(s => `<span class="trait-pill">${s}</span>`).join('')}
            </div>
            <strong>Spiritual Advice:</strong>
            <p style="font-style:italic; font-size:0.85rem; color: var(--accent-gold); margin-top:4px;">
              "${card.interp.advice}"
            </p>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Bind accordion toggles
  container.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
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
