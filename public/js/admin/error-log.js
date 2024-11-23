import { customFetch } from '../utils.js';

export function getErrorLogPage() {
  return `
    <link rel="stylesheet" href="/css/admin/error-log.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="error-log" class="error-log"></div>

    <script src="admin/error-log.js"></script>
  `;
}

export function errorLogPageTriggers(params) {
  fetchErrorLog(params?.id);
}

async function fetchErrorLog(id) {
  if (id) {
    const response = await customFetch(`/api/logs/${id}`);
    const data = await response.json();

    renderErrorLog(data);
  }
}

function renderErrorLog(errorLogData) {
  if (errorLogData) {
    const errorLog = document.getElementById('error-log');
    errorLog.innerHTML = `
    <table class="error-log-table">
      <tr>
        <th>ID</th>
        <td>${errorLogData.id}</td>
      </tr>
      <tr>
        <th>Timestamp</th>
        <td>${new Date(errorLogData.timestamp).toLocaleString()}</td>
      </tr>
      <tr>
        <th>Message</th>
        <td>${errorLogData.message}</td>
      </tr>
      <tr>
        <th>Status</th>
        <td class="${errorLogData.status >= 400 && errorLogData.status < 500 ? 'error-log-status-warning' : ''} ${errorLogData.status >= 500 && errorLogData.status < 600 ? 'error-log-status-error' : ''}">
          ${errorLogData.status}
        </td>
      </tr>
      <tr>
        <th>Context</th>
        <td>
          <div class="error-log-context">${JSON.stringify(errorLogData.context, null, 2)}</div>
        </td>
      </tr>
    </table>
  `;
  }
}
