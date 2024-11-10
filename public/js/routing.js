function fetchTerritoriesData() {
  fetch('/api/territories')
    .then((response) => response.json())
    .then((data) => {
      const territoriesList = document.getElementById('territories-list');
      territoriesList.innerHTML = ''; // Clear list

      data.forEach((territory) => {
        const li = document.createElement('li');
        li.textContent = territory.name;
        territoriesList.appendChild(li);
      });
    })
    .catch((err) => console.error('Error fetching territories:', err));
}

function handleRouteChange() {
  const path = window.location.pathname;

  if (path === '/territories') {
    fetchTerritoriesData();
  }
}

export function routingHandling() {
  // Trigger on page load
  document.addEventListener('DOMContentLoaded', handleRouteChange);

  // For doing dynamic routing in an SPA
  window.addEventListener('popstate', handleRouteChange);

  document.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent full page reload
      const target = event.target.getAttribute('href');

      history.pushState({}, '', target); // Update the URL
      // renderPage(); // Render the corresponding page dynamically
    });
  });
}
