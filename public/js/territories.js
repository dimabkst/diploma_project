import { customFetch } from './utils.js';
import { toastError } from './errors.js';

function fetchTerritoriesData() {
  customFetch('/api/territories')
    .then((response) => response.json())
    .then((data) => {
      const territoriesList = document.getElementById('territories-list');
      territoriesList.innerHTML = ''; // Clear list

      data?.territories?.forEach((territory) => {
        const li = document.createElement('li');
        li.textContent = territory.name;
        territoriesList.appendChild(li);
      });
    })
    .catch((err) => toastError(err));
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
