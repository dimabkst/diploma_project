import { createPagination } from '../pagination.js';
import { customFetch } from '../utils.js';

export function getErrorLogsPage() {
  return `
    <link rel="stylesheet" href="/css/admin/error-logs.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="error-logs-block">
        <div class="error-logs-count-search-sorting">
            <div id="error-logs-count" class="error-logs-count"></div>

            <div class="error-logs-filters-sorting">
                <input type="text" id="error-logs-search-status" class="error-logs-search error-logs-filters-sorting-item" placeholder="Status" />
                <input type="text" id="error-logs-search-method" class="error-logs-search error-logs-filters-sorting-item" placeholder="Method" />
                <input type="text" id="error-logs-search-base-url" class="error-logs-search error-logs-filters-sorting-item" placeholder="Base url" />

                <select id="error-logs-sorting" class="error-logs-sorting error-logs-filters-sorting-item">
                    <option value="sort_date:asc">Date Asc</option>
                    <option value="sort_date:desc" selected>Date Desc</option>                    
                    <option value="sort_status:asc">Status Asc</option>
                    <option value="sort_status:desc">Status Desc</option>
                </select>
            </div>
        </div>
        <div class="error-logs-header">
            <div class="error-logs-header-item">ID</div>
            <div class="error-logs-header-item">Date</div>
            <div class="error-logs-header-item">Status</div>
            <div class="error-logs-header-item">Method</div>
            <div class="error-logs-header-item">Base Url</div>
        </div>

        <div id="error-logs-list" class="error-logs-list"></div>
        <div id="pagination" class="pagination pagination-row"></div> 
    </div>

    <script src="admin/error-logs.js"></script>
  `;
}

export function errorLogsPageTriggers() {
  fetchErrorLogs();
  addEventListeners();
}

let pagination = {
  page: 1,
  limit: 20,
};
let filters = {
  level: 'ERROR',
  status: '',
  method: '',
  base_url: '',
};
let sorting = {
  sort_date: 'desc',
  sort_status: '',
};

async function fetchErrorLogs() {
  const params = new URLSearchParams({
    ...pagination,
    ...filters,
    ...sorting,
  });

  const response = await customFetch(`/api/logs?${params}`);
  const data = await response.json();

  const totalPages = pagination.limit & data.count ? Math.ceil(data.count / pagination.limit) : 1;

  renderErrorLogsList(data);
  createPagination(pagination, totalPages, fetchErrorLogs);
}

function renderErrorLogsList(errorLogsData) {
  const errorLogsList = document.getElementById('error-logs-list');
  errorLogsList.innerHTML = '';

  if (errorLogsData.logs?.length === 0) {
    errorLogsList.innerHTML = '<p class="error-logs-list-item">No error logs found</p>';
    return;
  }

  errorLogsData.logs?.forEach((errorLog) => {
    const errorLogElement = document.createElement('a');
    errorLogElement.setAttribute('href', `/admin/error-log/${errorLog.id}`);
    errorLogElement.setAttribute('data-route', '');

    errorLogElement.classList.add('error-logs-list-item');
    errorLogElement.innerHTML = `
        <div class="error-log-item error-log-id">${errorLog.id}</div>
        <div class="error-log-item error-log-date">${new Date(errorLog.timestamp).toLocaleDateString()}</div>
        <div class="error-log-item error-log-status ${errorLog.status >= 400 && errorLog.status < 500 ? 'error-log-status-warning' : ''} ${errorLog.status >= 500 && errorLog.status < 600 ? 'error-log-status-error' : ''}">${errorLog.status}</div>
        <div class="error-log-item error-log-method">${errorLog.context?.method}</div>
        <div class="error-log-item error-log-base-url">${errorLog.context?.url?.split('?')?.at(0)}</div>
    `;
    errorLogsList.appendChild(errorLogElement);
  });
}

function addEventListeners() {
  document.getElementById('error-logs-search-status').addEventListener('input', (event) => {
    filters.status = event.target.value;
    pagination.page = 1;
    fetchErrorLogs();
  });

  document.getElementById('error-logs-search-method').addEventListener('input', (event) => {
    filters.method = event.target.value;
    pagination.page = 1;
    fetchErrorLogs();
  });

  document.getElementById('error-logs-search-base-url').addEventListener('input', (event) => {
    filters.base_url = event.target.value;
    pagination.page = 1;
    fetchErrorLogs();
  });

  document.getElementById('error-logs-sorting').addEventListener('change', (event) => {
    Object.keys(sorting).forEach((key) => (sorting[key] = ''));
    const [key, value] = event.target.value.split(':');
    sorting[key] = value;
    fetchErrorLogs();
  });
}
