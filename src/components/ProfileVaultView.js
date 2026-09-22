/**
 * ASTRANUMERICS - PROFILE VAULT VIEW COMPONENT
 */

export function renderProfileVaultView(containerId, savedProfiles, onLoadProfile, onDeleteProfile, onExportVault, onImportVault) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="namelab-container">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
        <div>
          <h2 class="font-serif text-gold">💾 Profile Vault</h2>
          <p class="text-secondary" style="font-size:0.88rem;">Manage your saved personal, family, or client numerology charts.</p>
        </div>

        <div style="display:flex; gap:10px;">
          <button id="vault-export-btn" class="btn-ghost btn-sm">
            <span>📥 Export Backup (JSON)</span>
          </button>
          <label class="btn-ghost btn-sm" style="cursor:pointer; display:inline-flex; align-items:center;">
            <span>📤 Import Backup</span>
            <input type="file" id="vault-import-input" accept=".json" style="display:none;" />
          </label>
        </div>
      </div>

      ${savedProfiles.length === 0 ? `
        <div class="number-card" style="text-align:center; padding:32px;">
          <p class="text-muted">No saved profiles in your Vault yet. Fill out the hero form and click "Save to Profile Vault".</p>
        </div>
      ` : `
        <div class="vault-grid">
          ${savedProfiles.map((p, idx) => `
            <div class="vault-card" data-idx="${idx}">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:var(--accent-gold); font-family:var(--font-serif); font-size:1.05rem;">${p.name}</strong>
                <button class="btn-ghost btn-sm delete-profile-btn" data-idx="${idx}" style="min-height:28px; padding:2px 8px; color:var(--accent-rose);" title="Delete Profile">✕</button>
              </div>
              <span style="font-size:0.85rem; color:var(--text-secondary);">DOB: ${p.dob}</span>
              ${p.alias ? `<span style="font-size:0.8rem; color:var(--accent-starlight);">Alias: ${p.alias}</span>` : ''}
              <button class="btn-primary btn-sm load-profile-btn" data-idx="${idx}" style="margin-top:8px;">
                <span>✨ Open Chart</span>
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  // Bind export
  const exportBtn = container.querySelector('#vault-export-btn');
  if (exportBtn) exportBtn.addEventListener('click', onExportVault);

  // Bind import
  const importInput = container.querySelector('#vault-import-input');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (Array.isArray(data)) {
              onImportVault(data);
            } else {
              alert("Invalid backup file format.");
            }
          } catch (err) {
            alert("Error parsing backup JSON file: " + err.message);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Bind load & delete buttons
  container.querySelectorAll('.load-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      onLoadProfile(savedProfiles[idx]);
    });
  });

  container.querySelectorAll('.delete-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (confirm(`Delete profile "${savedProfiles[idx].name}" from Vault?`)) {
        onDeleteProfile(idx);
      }
    });
  });
}
