/**
 * ASTRANUMERICS - DAILY FORECAST VIEW WITH ORACLE WHEEL MINI-GAME
 */

import { calculatePersonalCycles } from '../utils/numerologyEngine.js';
import { DAILY_THEMES, CORE_INTERPRETATIONS } from '../data/numerologyData.js';
import { renderOracleWheelGame } from './OracleWheelGame.js';

export function renderDailyForecastView(containerId, profile) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!profile.dob) {
    container.innerHTML = `
      <div class="number-card" style="text-align: center; padding: 40px;">
        <h2 class="font-serif text-gold">Date of Birth Required</h2>
        <p class="text-muted">Enter your date of birth to calculate your Personal Year, Month, & Day cycles.</p>
      </div>
    `;
    return;
  }

  const now = new Date();
  const cycles = calculatePersonalCycles(profile.dob, now);

  const themeDay = DAILY_THEMES[cycles.personalDay] || DAILY_THEMES[1];
  const themeYear = CORE_INTERPRETATIONS[cycles.personalYear] || CORE_INTERPRETATIONS[1];

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString(undefined, dateOptions);

  container.innerHTML = `
    <div class="synastry-layout">
      <!-- Top Calendar Banner -->
      <div class="hero-section" style="text-align:center;">
        <span class="card-tag">Daily Cosmic Guidance</span>
        <h2 class="font-serif text-gold" style="margin-top:8px;">${formattedDate}</h2>
        <p class="text-secondary" style="font-size:0.9rem;">Synced to DOB: <strong>${profile.dob}</strong></p>
      </div>

      <!-- Interactive Daily Oracle Fortune Wheel Mini-Game -->
      <div id="oracle-game-container"></div>

      <!-- Cycle Badges Grid -->
      <div class="reading-grid">
        <!-- Personal Day -->
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Today's Personal Day</span>
            <div class="number-badge-glow">${cycles.personalDay}</div>
          </div>
          <h3 class="card-title">${themeDay.focus}</h3>
          <p class="card-summary" style="font-style:italic; color:var(--accent-gold);">
            "${themeDay.affirmation}"
          </p>
        </div>

        <!-- Personal Month -->
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">Current Personal Month</span>
            <div class="number-badge-glow">${cycles.personalMonth}</div>
          </div>
          <h3 class="card-title">Monthly Focus Theme ${cycles.personalMonth}</h3>
          <p class="card-summary">This month emphasizes themes aligned with vibration ${cycles.personalMonth}, guiding mid-range planning and energetic focus.</p>
        </div>

        <!-- Personal Year -->
        <div class="number-card">
          <div class="card-header-badge">
            <span class="card-tag">9-Year Cycle Stage</span>
            <div class="number-badge-glow">${cycles.personalYear}</div>
          </div>
          <h3 class="card-title">Personal Year ${cycles.personalYear}: ${themeYear.title}</h3>
          <p class="card-summary">${themeYear.summary}</p>
        </div>
      </div>
    </div>
  `;

  // Render Oracle Wheel Game
  renderOracleWheelGame('oracle-game-container');
}
