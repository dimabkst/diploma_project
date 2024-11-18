import { getTerritoriesPage, territoriesPageTriggers } from './territories.js';

const routes = {
  '/territories': {
    template: getTerritoriesPage,
    triggers: territoriesPageTriggers,
  },
};

function renderPage(path) {
  const appRoot = document.getElementById('app-root');

  if (!appRoot) {
    console.error('App root element not found');
    return;
  }

  const route = routes[path];

  if (route && route.template) {
    appRoot.innerHTML = route.template();
  } else {
    appRoot.innerHTML = `<h1>Page Not Found</h1>`;
  }
}

function executePageTriggers(path) {
  const route = routes[path];
  if (route && route.triggers) {
    route.triggers();
  }
}

export function isServerRenderedRoute(path) {
  return ['/login', '/register', '/', '/products'].includes(path);
}

function handleRouteChange() {
  const path = window.location.pathname;

  if (!isServerRenderedRoute(path)) {
    renderPage(path);
    executePageTriggers(path);
  } else if (sessionStorage.getItem('lastRedirectedPath') !== path) {
    sessionStorage.setItem('lastRedirectedPath', path);
    window.location.href = path;
  }
}

export function routingHandling() {
  // Trigger on page load
  document.addEventListener('DOMContentLoaded', () => {
    const lastRedirectedPath = sessionStorage.getItem('lastRedirectedPath');

    handleRouteChange();

    // remove item only if it was set before, so there won't be loop when opening page for the first time
    if (lastRedirectedPath) {
      sessionStorage.removeItem('lastRedirectedPath');
    }
  });

  // For doing dynamic routing in an SPA
  window.addEventListener('popstate', handleRouteChange);

  document.querySelectorAll('a[data-route]').forEach((link) => {
    link.addEventListener('click', function (event) {
      const target = event.target.closest('a[data-route]');

      if (target) {
        event.preventDefault();

        const href = target.getAttribute('href');

        if (href && href !== window.location.pathname) {
          history.pushState({}, '', href);
          handleRouteChange();
        }
      }
    });
  });
}
