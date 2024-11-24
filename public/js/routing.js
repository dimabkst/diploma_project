import { cartPageTriggers, getCartPage } from './cart.js';
import { getOrdersPage, ordersPageTriggers } from './orders.js';
import { getProductsPage, productsPageTriggers } from './products.js';
import { errorLogsPageTriggers, getErrorLogsPage } from './admin/error-logs.js';
import { errorLogPageTriggers, getErrorLogPage } from './admin/error-log.js';

const routes = {
  '/products': {
    template: getProductsPage,
    triggers: productsPageTriggers,
  },
  '/cart': {
    template: getCartPage,
    triggers: cartPageTriggers,
  },
  '/orders': {
    template: getOrdersPage,
    triggers: ordersPageTriggers,
  },
  '/admin/error-logs': {
    template: getErrorLogsPage,
    triggers: errorLogsPageTriggers,
  },
  '/admin/error-log/:id': {
    template: getErrorLogPage,
    triggers: errorLogPageTriggers,
  },
};

function matchRoute(path) {
  for (const route of Object.keys(routes)) {
    const regex = new RegExp(
      '^' +
        route
          .replace(/:[^/]+/g, '([^/]+)') // replace params (like :id) with a capture groups
          .replace(/\//g, '\\/') + // escape slashes
        '$'
    );

    const match = path.match(regex);
    if (match) {
      const params = {};

      // extract dynamic params
      const keys = [...route.matchAll(/:([^/]+)/g)].map((m) => m[1]);
      keys.forEach((key, i) => {
        params[key] = match[i + 1]; // match groups start at index 1
      });

      return { route, params };
    }
  }

  return { route: path };
}

function renderPage(path, params) {
  const appRoot = document.getElementById('app-root');

  if (!appRoot) {
    console.error('App root element not found');
    return;
  }

  const route = routes[path];

  if (route && route.template) {
    appRoot.innerHTML = route.template(params);
  } else {
    appRoot.innerHTML = `<h1>Page Not Found</h1>`;
  }
}

function executePageTriggers(path, params) {
  const route = routes[path];
  if (route && route.triggers) {
    route.triggers(params);
  }
}

export function isServerRenderedRoute(path) {
  return ['/login', '/register', '/', '/admin'].includes(path);
}

function setActiveTab(path) {
  const tabElementClasses = ['header-menu-item-anchor', 'header-cart-button'];

  tabElementClasses.forEach((elementClass) => {
    document.querySelectorAll(`a.${elementClass}`).forEach((link) => {
      link.classList.remove('active');
    });

    document.querySelectorAll(`a.${elementClass}[href="${path}"]`).forEach((link) => {
      link.classList.add('active');
    });
  });
}

function handleRouteChange() {
  const path = window.location.pathname;

  setActiveTab(path);

  const matchedRoute = matchRoute(path);

  if (!isServerRenderedRoute(matchedRoute?.route)) {
    renderPage(matchedRoute?.route, matchedRoute?.params);
    executePageTriggers(matchedRoute?.route, matchedRoute?.params);
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
