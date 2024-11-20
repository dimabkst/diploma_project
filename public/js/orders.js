import { createPagination } from './pagination.js';
import { customFetch } from './utils.js';

export function getOrdersPage() {
  return `
    <link rel="stylesheet" href="/css/orders.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="orders-block">
        <div class="orders-header">
            <div class="orders-header-item">Order ID</div>
            <div class="orders-header-item sortable" data-sort="creation-date">
                Creation Date
            </div>
            <div class="orders-header-item sortable" data-sort="status">
                Status
            </div>
            <div class="orders-header-item sortable" data-sort="total-amount">
                Total Amount
            </div>
        </div>

        <div id="orders-list" class="orders-list"></div>
        <div id="pagination" class="pagination pagination-row"></div> 
    </div>

    <script src="orders.js"></script>
  `;
}

export function ordersPageTriggers() {
  fetchOrders();
}

let pagination = {
  page: 1,
  limit: 20,
};
let filters = {
  sort_by_order_date: 'asc',
};

async function fetchOrders() {
  const params = new URLSearchParams({
    ...pagination,
    ...filters,
  });

  const response = await customFetch(`/api/orders?${params}`);
  const data = await response.json();

  const totalPages = pagination.limit & data.count ? Math.ceil(data.count / pagination.limit) : 1;

  renderOrdersList(data);
  createPagination(pagination, totalPages, fetchOrders);
}

function renderOrdersList(ordersData) {
  const ordersList = document.getElementById('orders-list');
  ordersList.innerHTML = '';

  ordersData.orders?.forEach((order) => {
    const orderElement = document.createElement('div');
    orderElement.classList.add('orders-list-item');
    orderElement.innerHTML = `
        <div class="order-item order-id">${order.id}</div>
        <div class="order-item order-creation-date">${new Date(order.createdAt).toLocaleDateString()}</div>
        <div class="order-item order-status">${order.status}</div>
        <div class="order-item order-total-amount">$${order.totalAmount.toFixed(2)}</div>
    `;
    ordersList.appendChild(orderElement);
  });
}
