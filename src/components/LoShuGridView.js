/**
 * ASTRANUMERICS - SACRED ARTIFACT LO SHU MATRIX POWER GRID
 */

import { calculateLoShuGrid } from '../utils/numerologyEngine.js';
import { playChimeTap } from '../utils/soundEngine.js';

export function renderLoShuGridView(containerId, profile) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif-carved text-oxblood">DOB REQUIRED FOR POWER MATRIX</h2>
        <p class="text-secondary">Enter date of birth above to construct your 3x3 Lo Shu Matrix.</p>
      </div>
    `;
    return;
  }

  const { counts, arrows, planes } = calculateLoShuGrid(profile.dob);
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
      <!-- 3x3 Grid Card -->
      <div class="loshu-square">
        <h2 class="font-serif-carved text-oxblood">CHAMBER 2: POWER MATRIX GRID</h2>
        <p class="text-secondary" style="font-size:0.9rem; text-align:center;">
          3x3 Sacred Geometry Matrix derived from DOB: <strong>${profile.dob}</strong>
        </p>

        <div class="loshu-grid-matrix">
          ${gridCellsHtml}
        </div>
      </div>

      <!-- Planes & Arrows Breakdown -->
      <div class="loshu-planes-card">
        <h2 class="font-serif-carved text-brass mb-4">PLANE STATS & ARROWS</h2>

        <!-- Planes Scores as Engraved Meters -->
        <div style="margin-bottom:20px;">
          <h3 class="font-serif-carved" style="font-size:1.1rem; color:var(--accent-brass); margin-bottom:8px;">PLANE FREQUENCIES</h3>
          
          <div class="arrow-item">
            <strong>Mental Plane (4, 9, 2):</strong> Score ${planes.mental.score}
            <div class="hp-meter-track" style="margin-top:4px;">
              <div class="hp-meter-fill" style="width:${Math.min(100, planes.mental.score * 33)}%; background:var(--accent-slate-green);"></div>
            </div>
          </div>

          <div class="arrow-item">
            <strong>Emotional Plane (3, 5, 7):</strong> Score ${planes.emotional.score}
            <div class="hp-meter-track" style="margin-top:4px;">
              <div class="hp-meter-fill" style="width:${Math.min(100, planes.emotional.score * 33)}%; background:var(--accent-brass);"></div>
            </div>
          </div>

          <div class="arrow-item">
            <strong>Physical Plane (8, 1, 6):</strong> Score ${planes.physical.score}
            <div class="hp-meter-track" style="margin-top:4px;">
              <div class="hp-meter-fill" style="width:${Math.min(100, planes.physical.score * 33)}%; background:var(--accent-oxblood);"></div>
            </div>
          </div>
        </div>

        <!-- Arrows of Strength -->
        <div style="margin-bottom:20px;">
          <h3 class="font-serif-carved" style="font-size:1.1rem; color:var(--accent-slate-green); margin-bottom:8px;">
            ⚡ ARROWS OF STRENGTH (${strengthArrows.length})
          </h3>
          ${strengthArrows.length > 0 ? strengthArrows.map(a => `
            <div class="arrow-item active-strength">
              <strong>${a.name}</strong> [Numbers: ${a.numbers.join(', ')}]
            </div>
          `).join('') : '<p class="text-secondary" style="font-size:0.88rem;">No active arrows of strength in birth matrix.</p>'}
        </div>

        <!-- Arrows of Weakness / Lessons -->
        <div>
          <h3 class="font-serif-carved" style="font-size:1.1rem; color:var(--accent-oxblood); margin-bottom:8px;">
            ⚠️ SHADOW ARROWS (${weaknessArrows.length})
          </h3>
          ${weaknessArrows.length > 0 ? weaknessArrows.map(a => `
            <div class="arrow-item active-weakness">
              <strong>${a.name}</strong>
            </div>
          `).join('') : '<p class="text-secondary" style="font-size:0.88rem;">Balanced matrix without empty plane shadow arrows.</p>'}
        </div>
      </div>
    </div>
  `;

  // Bind cell chime triggers
  container.querySelectorAll('.loshu-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => playChimeTap());
  });
}
