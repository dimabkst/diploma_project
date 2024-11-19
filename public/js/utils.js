import { toastError } from './errors.js';

export async function customFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    // Check if HX-Redirect header is present and handle redirection
    const redirectUrl = response.headers.get('HX-Redirect');

    if (redirectUrl) {
      history.pushState({}, '', redirectUrl);
      window.dispatchEvent(new PopStateEvent('popstate')); // Triggers a route change
    }

    if (!response?.ok) {
      throw response;
    }

    if (redirectUrl) return null;

    return response;
  } catch (e) {
    await toastError(e);

    return null;
  }
}

export function productImagePlaceholder(className = '') {
  return `<svg ${className ? `class="${className}"` : ''} xmlns="http://www.w3.org/2000/svg" fill="#dbdbdb" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
}
