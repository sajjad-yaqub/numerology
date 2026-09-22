/**
 * ASTRANUMERICS - SACRED CHAMBER ROUTER
 * Client-side HTML5 History API router mapping paths to chamber tabs.
 */

const ROUTES = {
  '/': 'reading',
  '/reading': 'reading',
  '/loshu': 'loshu',
  '/synastry': 'synastry',
  '/namelab': 'namelab',
  '/forecast': 'forecast',
  '/address': 'address',
  '/vault': 'vault'
};

const TAB_TO_PATH = {
  reading: '/reading',
  loshu: '/loshu',
  synastry: '/synastry',
  namelab: '/namelab',
  forecast: '/forecast',
  address: '/address',
  vault: '/vault'
};

/**
 * Extract active chamber tab from URL pathname
 */
export function getRouteFromPath(pathname = window.location.pathname) {
  const normalized = pathname.toLowerCase().replace(/\/$/, '') || '/';
  return ROUTES[normalized] || 'reading';
}

/**
 * Get URL path for a given chamber tab
 */
export function getPathFromTab(tab) {
  return TAB_TO_PATH[tab] || '/reading';
}

/**
 * Navigate to a specific URL path with HTML5 history push
 */
export function navigateTo(path, onChangeCallback = null) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  if (onChangeCallback) {
    onChangeCallback(getRouteFromPath(path));
  }
}

/**
 * Initialize popstate listener for browser Back/Forward buttons
 */
export function initRouter(onRouteChange) {
  window.addEventListener('popstate', () => {
    const route = getRouteFromPath(window.location.pathname);
    onRouteChange(route);
  });
  return getRouteFromPath(window.location.pathname);
}
