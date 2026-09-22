/**
 * ASTRANUMERICS - LO SHU SQUARE & SACRED GRID COMPONENT
 */

import { calculateLoShuGrid } from '../utils/numerologyEngine.js';

export function renderLoShuGridView(containerId, profile) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif text-gold">Date of Birth Required</h2>
        <p class="text-muted">Enter your date of birth to construct your 3x3 Lo Shu Matrix.</p>
      </div>
    `;
    return;
  }

  const { counts, arrows, planes } = calculateLoShuGrid(profile.dob);

  // Traditional Lo Shu 3x3 layout position mapping
  // Row 1: 4, 9, 2
  // Row 2: 3, 5, 7
  // Row 3: 8, 1, 6
  const gridPositions = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  let gridCellsHtml = '';
  for (const num of gridPositions) {
    const freq = counts[num] || 0;
    const isPresent = freq > 0;

    gridCellsHtml += `
      <div class="loshu-cell ${isPresent ? 'present' : ''}">
        ${isPresent ? `<span class="loshu-count-badge">${freq}x</span>` : ''}
        <span class="loshu-cell-num">${isPresent ? String(num).repeat(Math.min(freq, 3)) : num}</span>
      </div>
    `;
  }

  const strengthArrows = arrows.filter(a => a.type === 'strength');
  const weaknessArrows = arrows.filter(a => a.type === 'weakness');

  container.innerHTML = `
    <div class="loshu-container">
      <!-- 3x3 Grid Square Card -->
      <div class="loshu-square">
        <h2 class="font-serif text-gold">Sacred Lo Shu Square</h2>
        <p class="text-secondary" style="font-size:0.85rem; text-align:center;">
          Ancient Chinese 3x3 Magic Square derived from DOB: <strong>${profile.dob}</strong>
        </p>

        <div class="loshu-grid-matrix">
          ${gridCellsHtml}
        </div>
      </div>

      <!-- Planes & Arrows Breakdown -->
      <div class="loshu-planes-card">
        <h2 class="font-serif text-gold mb-4">Planes & Cosmic Arrows</h2>

        <!-- Planes Scores -->
        <div style="margin-bottom:20px;">
          <h3 class="font-serif" style="font-size:1rem; color:var(--accent-starlight); margin-bottom:8px;">Frequency Planes</h3>
          <div class="arrow-item">
            <strong>Mental Plane (4, 9, 2):</strong> Score ${planes.mental.score}
          </div>
          <div class="arrow-item">
            <strong>Emotional Plane (3, 5, 7):</strong> Score ${planes.emotional.score}
          </div>
          <div class="arrow-item">
            <strong>Physical Plane (8, 1, 6):</strong> Score ${planes.physical.score}
          </div>
        </div>

        <!-- Arrows of Strength -->
        <div style="margin-bottom:20px;">
          <h3 class="font-serif" style="font-size:1rem; color:var(--accent-emerald); margin-bottom:8px;">
            ✨ Arrows of Strength (${strengthArrows.length})
          </h3>
          ${strengthArrows.length > 0 ? strengthArrows.map(a => `
            <div class="arrow-item active-strength">
              <strong>${a.name}</strong> [Numbers: ${a.numbers.join(', ')}]
            </div>
          `).join('') : '<p class="text-muted" style="font-size:0.85rem;">No active arrows of strength in birth grid.</p>'}
        </div>

        <!-- Arrows of Weakness / Lessons -->
        <div>
          <h3 class="font-serif" style="font-size:1rem; color:var(--accent-rose); margin-bottom:8px;">
            ⚡ Arrows of Weakness / Lessons (${weaknessArrows.length})
          </h3>
          ${weaknessArrows.length > 0 ? weaknessArrows.map(a => `
            <div class="arrow-item active-weakness">
              <strong>${a.name}</strong>
            </div>
          `).join('') : '<p class="text-muted" style="font-size:0.85rem;">Balanced grid without major empty plane arrows.</p>'}
        </div>
      </div>
    </div>
  `;
}
