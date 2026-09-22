/**
 * ASTRANUMERICS - CALCULATOR HERO FORM COMPONENT
 */

export function renderCalculatorForm(containerId, initialProfile, onSubmit, onSave) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="hero-header">
      <h1 class="hero-title">Sacred Numerology & Cosmic Chart</h1>
      <p class="hero-subtitle">Enter your birth credentials to generate your complete core reading, Lo Shu matrix, & synastry chart.</p>
    </div>

    <form id="numerology-form">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="full-name">Full Birth Name</label>
          <input type="text" id="full-name" class="form-input" placeholder="e.g. Alexander William Sterling" value="${initialProfile.name || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="dob">Date of Birth</label>
          <input type="date" id="dob" class="form-input" value="${initialProfile.dob || '1995-07-21'}" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="current-alias">Current Name / Preferred Alias (Optional)</label>
          <input type="text" id="current-alias" class="form-input" placeholder="e.g. Alex Sterling" value="${initialProfile.alias || ''}" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <span>✨ Generate Cosmic Reading</span>
        </button>
        <button type="button" id="save-profile-btn" class="btn-ghost">
          <span>💾 Save to Profile Vault</span>
        </button>
      </div>
    </form>
  `;

  const form = container.querySelector('#numerology-form');
  const saveBtn = container.querySelector('#save-profile-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#full-name').value.trim();
    const dob = form.querySelector('#dob').value;
    const alias = form.querySelector('#current-alias').value.trim();
    if (name && dob) {
      onSubmit({ name, dob, alias });
    }
  });

  saveBtn.addEventListener('click', () => {
    const name = form.querySelector('#full-name').value.trim();
    const dob = form.querySelector('#dob').value;
    const alias = form.querySelector('#current-alias').value.trim();
    if (name && dob) {
      onSave({ name, dob, alias });
    } else {
      alert("Please enter a Full Birth Name and Date of Birth to save profile.");
    }
  });
}
