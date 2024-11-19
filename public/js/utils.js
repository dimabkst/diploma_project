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
