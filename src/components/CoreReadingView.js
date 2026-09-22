/**
 * ASTRANUMERICS - SACRED ARTIFACT CORE READING VIEW
 */

import {
  calculateLifePath,
  calculateNameNumbers,
  calculateAttitudeNumber,
  calculateMaturityNumber,
  composeCombinatorialSynthesis
} from '../utils/numerologyEngine.js';
import { CORE_INTERPRETATIONS, KARMIC_DEBT_DETAILS, NAVAGRAHA_MAP, getCoreInterpretation } from '../data/numerologyData.js';
import { playChimeTap, playConfirmChime } from '../utils/soundEngine.js';
import { t, getLanguage } from '../utils/i18n.js';

export function renderCoreReadingView(containerId, profile, system = 'pythagorean') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentLang = getLanguage();

  if (!profile.name || !profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif-carved text-oxblood">ENTER SEEKER CREDENTIALS ABOVE</h2>
        <p class="text-secondary">Type full birth name and date of birth to reveal your Relic Codex.</p>
      </div>
    `;
    return;
  }

  const lifePath = calculateLifePath(profile.dob);
  const nameNums = calculateNameNumbers(profile.name, system);
  const attitude = calculateAttitudeNumber(profile.dob);
  const maturity = calculateMaturityNumber(lifePath.reduced, nameNums.expression.reduced);
  const synthesis = composeCombinatorialSynthesis(profile.dob, profile.name, system);

  const cardsData = [
    {
      title: t('cards.lifePath', 'Life Path Rank'),
      tag: t('tags.primary', 'PRIMARY CLASS'),
      number: lifePath.reduced,
      meta: lifePath,
      interp: getCoreInterpretation(lifePath.reduced, currentLang)
    },
    {
      title: t('cards.expression', 'Expression Destiny'),
      tag: t('tags.skill', 'SKILL SPECTRUM'),
      number: nameNums.expression.reduced,
      meta: nameNums.expression,
      interp: getCoreInterpretation(nameNums.expression.reduced, currentLang)
    },
    {
      title: t('cards.soulUrge', 'Soul Urge Frequency'),
      tag: t('tags.vowels', 'VOWEL AFFINITY'),
      number: nameNums.soulUrge.reduced,
      meta: nameNums.soulUrge,
      interp: getCoreInterpretation(nameNums.soulUrge.reduced, currentLang)
    },
    {
      title: t('cards.personality', 'Personality Shield'),
      tag: t('tags.shield', 'OUTER SHIELD'),
      number: nameNums.personality.reduced,
      meta: nameNums.personality,
      interp: getCoreInterpretation(nameNums.personality.reduced, currentLang)
    },
    {
      title: t('cards.attitude', 'Attitude Sun Rank'),
      tag: t('tags.firstReaction', 'FIRST REACTION'),
      number: attitude.reduced,
      meta: attitude,
      interp: getCoreInterpretation(attitude.reduced, currentLang)
    },
    {
      title: t('cards.maturity', 'Maturity Power Rank'),
      tag: t('tags.endgame', 'END-GAME UNLOCK'),
      number: maturity.reduced,
      meta: maturity,
      interp: getCoreInterpretation(maturity.reduced, currentLang)
    }
  ];

  let html = '';

  if (synthesis) {
    let localizedSynergyTag = synthesis.synergyTag;
    let localizedSynergyDesc = synthesis.synergyDesc;

    if (synthesis.lpNum === synthesis.expNum) {
      localizedSynergyTag = t('synthesis.unified', synthesis.synergyTag);
      localizedSynergyDesc = t('synthesis.unifiedDesc', synthesis.synergyDesc);
    } else if (Math.abs(synthesis.lpNum - synthesis.expNum) % 2 === 0 || synthesis.lpNum === 11 || synthesis.expNum === 11 || synthesis.lpNum === 22 || synthesis.expNum === 22) {
      localizedSynergyTag = t('synthesis.complementary', synthesis.synergyTag);
      localizedSynergyDesc = t('synthesis.complementaryDesc', synthesis.synergyDesc);
    } else {
      localizedSynergyTag = t('synthesis.catalyst', synthesis.synergyTag);
      localizedSynergyDesc = t('synthesis.catalystDesc', synthesis.synergyDesc);
    }

    html += `
      <div class="number-card synthesis-nexus-card mb-6" style="border-color: var(--accent-brass); background: rgba(156, 107, 31, 0.04);">
        <div class="card-header-badge">
          <span class="card-tag">${t('synthesis.nexus', 'COMBINATORIAL SYNTHESIS NEXUS')}</span>
          <div class="number-badge-glow master-badge-glow" title="Synthesis Medallion">
            ${synthesis.lpNum}⚡${synthesis.expNum}
          </div>
        </div>

        <h2 class="card-title font-serif-carved" style="color: var(--accent-brass); margin-top: 0.5rem;">
          ${localizedSynergyTag}
        </h2>
        
        <p class="card-summary" style="font-size: 1rem; line-height: 1.5; margin-bottom: 1rem;">
          ${localizedSynergyDesc}
        </p>

        <div class="arrow-grid mb-2" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">
          <div class="arrow-item active-strength">
            <strong>🔥 ${t('synthesis.elemental', 'ELEMENTAL FUSION')} (${synthesis.lpElem} + ${synthesis.expElem})</strong>
            <p style="font-size:0.85rem; margin-top:4px;">${synthesis.elementalSummary}</p>
          </div>

          <div class="arrow-item active-strength">
            <strong>🛡️ ${t('synthesis.heartVsMask', 'HEART vs. MASK FREQUENCY')}</strong>
            <p style="font-size:0.85rem; margin-top:4px;">${synthesis.innerOuterText}</p>
          </div>

          <div class="arrow-item ${synthesis.karmicDebts.length ? 'active-weakness' : 'active-strength'}">
            <strong>📜 ${t('synthesis.karmicGrid', 'KARMIC & GRID SPECTRUM')}</strong>
            <p style="font-size:0.85rem; margin-top:4px;">
              ${synthesis.karmicDebts.length 
                ? `Active Debt Lessons: ${synthesis.karmicDebts.map(d => d.name).join(', ')}`
                : `Clean Karmic Flow • Grid: ${synthesis.activeArrows}`}
            </p>
          </div>
        </div>
      </div>
    `;
  }


  html += `<div class="reading-grid">`;

  cardsData.forEach((card, idx) => {
    const isMaster = card.meta.isMaster;
    const debt = card.meta.karmicDebt;
    const statPct = Math.min(100, Math.max(20, (card.number / 9) * 100));
    const navagraha = NAVAGRAHA_MAP[card.number];

    html += `
      <div class="number-card" id="card-${idx}">
        <div class="card-header-badge">
          <span class="card-tag">${card.tag}</span>
          <div class="number-badge-glow ${isMaster ? 'master-badge-glow' : ''}" title="Coin Medallion Badge">
            ${card.number}
          </div>
        </div>

        <h2 class="card-title">${card.title}</h2>
        <div class="card-archetype">${card.interp.archetype || ''} • ${card.interp.element || ''}</div>

        ${navagraha ? `
          <div class="arrow-item active-strength mb-3" style="background: rgba(156, 107, 31, 0.08); border-color: var(--accent-brass); padding: 8px 12px;">
            <strong style="color: var(--accent-brass);">🔱 VEDIC NAVAGRAHA: ${navagraha.deity}</strong>
            <p style="font-size:0.82rem; margin-top:2px;">
              ${navagraha.quality} • <em>Mantra: ${navagraha.mantra}</em>
            </p>
          </div>
        ` : ''}

        <p class="card-summary">${card.interp.summary}</p>

        <!-- Engraved Calculation Progress Meter -->
        <div class="hp-meter-box">
          <div class="hp-meter-label">
            <span>ENGRAVED FREQUENCY METER</span>
            <span>${Math.round(statPct)}/100</span>
          </div>
          <div class="hp-meter-track">
            <div class="hp-meter-fill" style="width: ${statPct}%;"></div>
          </div>
        </div>

        ${debt ? `
          <div class="arrow-item active-weakness mb-4">
            <strong>⚠️ DEBT LESSON: ${debt.name}</strong>
            <p style="font-size:0.88rem; margin-top:4px;">${KARMIC_DEBT_DETAILS[debt.debt]?.lesson || ''}</p>
          </div>
        ` : ''}

        <div class="card-details-accordion">
          <button class="accordion-toggle" data-target="acc-${idx}">
            <span>📜 SPELL CODEX & ADVICE</span>
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
            <p style="font-style:italic; font-size:0.9rem; color: var(--accent-brass); margin-top:4px;">
              "${card.interp.advice}"
            </p>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Bind accordion toggles & metallic chime triggers
  container.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('mouseenter', () => playChimeTap());
    btn.addEventListener('click', () => {
      playConfirmChime();
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
