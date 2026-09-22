/**
 * ASTRANUMERICS - RAZORPAY PAYMENT ENGINE
 * Seamless Pay-Per-Transaction utility connecting to https://razorpay.me/@karthikdinne
 * Supports 100% localStorage state preservation for zero data loss during redirects.
 */

export const RAZORPAY_ME_URL = 'https://razorpay.me/@karthikdinne';

export const FEATURE_PRICING = {
  namelab: {
    id: 'namelab',
    title: 'Name Transmuter Lab',
    price: 51,
    formattedPrice: '₹51',
    description: 'Unlimited spelling tweaks, letter-by-letter Chaldean analysis, Navagraha impact & Name Advice.'
  },
  address: {
    id: 'address',
    title: 'Address, Phone & Vehicle Numerology',
    price: 101,
    formattedPrice: '₹101',
    description: 'Complete space energy analysis, Shubh/Ashubh rating, vehicle plate suitability & remedies.'
  },
  synastry: {
    id: 'synastry',
    title: 'Synastry & Relationship Report',
    price: 151,
    formattedPrice: '₹151',
    description: 'Deep 10-point dual-profile compatibility report & downloadable WhatsApp PDF summary.'
  }
};

/**
 * Check if a feature is unlocked locally.
 */
export function isFeatureUnlocked(featureId) {
  if (!featureId) return false;
  return localStorage.getItem(`astranumerics_unlocked_${featureId}`) === 'true';
}

/**
 * Unlock a feature locally.
 */
export function setFeatureUnlocked(featureId) {
  if (!featureId) return;
  localStorage.setItem(`astranumerics_unlocked_${featureId}`, 'true');
}

/**
 * Save current state & redirect to Razorpay Payment Link.
 */
export function saveStateAndRedirectToRazorpay(featureId, currentProfile, extraData = {}) {
  const pricing = FEATURE_PRICING[featureId];
  if (!pricing) return;

  // Save current state into localStorage before leaving the page
  const pendingState = {
    feature: featureId,
    profile: currentProfile,
    extraData,
    timestamp: Date.now()
  };

  localStorage.setItem('astranumerics_pending_payment', JSON.stringify(pendingState));

  // Redirect to Razorpay payment page
  window.location.href = RAZORPAY_ME_URL;
}

/**
 * Check on app initialization if user just returned from a payment or has a URL query flag.
 */
export function checkAndHandlePaymentReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment') || urlParams.get('status');
  const queryFeature = urlParams.get('feature');

  const pendingJson = localStorage.getItem('astranumerics_pending_payment');
  let pendingState = null;

  if (pendingJson) {
    try {
      pendingState = JSON.parse(pendingJson);
    } catch (e) {
      console.error('Failed to parse pending payment state', e);
    }
  }

  // Handle URL callback or pending state unlock
  if (paymentStatus === 'success' || paymentStatus === 'captured' || pendingState) {
    const targetFeature = queryFeature || (pendingState ? pendingState.feature : null);

    if (targetFeature) {
      setFeatureUnlocked(targetFeature);
    }

    const restoredProfile = pendingState ? pendingState.profile : null;
    const restoredExtra = pendingState ? pendingState.extraData : null;

    // Clean up pending state & URL parameters
    localStorage.removeItem('astranumerics_pending_payment');
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    return {
      justReturned: true,
      unlockedFeature: targetFeature,
      profile: restoredProfile,
      extraData: restoredExtra
    };
  }

  return { justReturned: false };
}
