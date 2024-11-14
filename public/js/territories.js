import { customFetch } from './utils.js';

function fetchTerritoriesData() {
  customFetch('/api/territories')
    .then((response) => {
      if (!response) return;

      return response.json();
    })
    .then((data) => {
      if (!data) return;

      const territoriesList = document.getElementById('territories-list');
      territoriesList.innerHTML = ''; // Clear list

      data.territories?.forEach((territory) => {
        const li = document.createElement('li');
        li.textContent = territory.name;
        territoriesList.appendChild(li);
      });
    });
}

export function getTerritoriesPage() {
  return `
    <h1>Territories</h1>
    <ul id="territories-list"></ul>
  `;
}

export function territoriesPageTriggers() {
  fetchTerritoriesData();
}
