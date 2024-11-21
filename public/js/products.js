import { createPagination } from './pagination.js';
import { customFetch, productImagePlaceholder } from './utils.js';

export function getProductsPage() {
  return `
    <link rel="stylesheet" href="/css/products.css"/>
    <link rel="stylesheet" href="/css/pagination.css"/>

    <div id="products-block">
      <div class="products-count-search-sorting">
          <div id="products-count" class="products-count"></div>

          <div class="search-sorting">
              <input type="text" id="search" class="search" placeholder="Search products..." />

              <select id="sorting" class="sorting">
                  <option value="sort_name:asc">Name A-Z</option>
                  <option value="sort_name:desc">Name Z-A</option>
              </select>
          </div>
      </div>

      <div class="filters-product-list-pagination">
          <div class="filters">
              <div id="categories-filter" class="filter checkbox-filter"></div>
              <div id="manufacturers-filter" class="filter checkbox-filter"></div>
              <div id="price-filter" class="filter price-filter">
                  <h3 class="filter-title">Price</h3>
                  <div class="price-inputs">
                      <input type="number" id="price-min" class="price-input" placeholder="Min" min="0" step="1" value=""/>
                      <input type="number" id="price-max" class="price-input" placeholder="Max" min="0" step="1" value=""/>
                      <button id="apply-price-filter">OK</button>
                  </div>
              </div>

          </div>

          <div class="products-list-pagination">
              <div id="products-list" class="products-list"></div>
              <div id="pagination" class="pagination pagination-row"></div>
          </div>
      </div>
    </div>

    <script src="products.js"></script>
  `;
}

export function productsPageTriggers() {
  fetchCategories();
  fetchManufacturers();
  fetchProducts();
  addEventListeners();
}

let pagination = {
  page: 1,
  limit: 50,
};
let filters = {
  sort_name: 'asc',
  category_ids: '',
  manufacturer_ids: '',
  price_gte: '',
  price_lte: '',
};

async function fetchProducts() {
  const params = new URLSearchParams({
    ...pagination,
    ...filters,
  });

  const response = await customFetch(`/api/products/?${params}`);
  const data = await response.json();

  const totalPages = pagination.limit & data.count ? Math.ceil(data.count / pagination.limit) : 1;

  renderProducts(data.products, data.count);
  createPagination(pagination, totalPages, fetchProducts);
}

function renderProducts(products, count) {
  const productsCount = document.getElementById('products-count');
  productsCount.innerHTML = `Found products: ${count || 0}`;

  const productsList = document.getElementById('products-list');
  productsList.innerHTML = ''; // Clear existing products

  if (products.length === 0) {
    productsList.innerHTML = '<p>No products found</p>';
    return;
  }

  const imagePlaceholder = productImagePlaceholder('product-item-image');
  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product-item');
    productElement.innerHTML = `
      ${product.image ? `<img class="product-item-image" src="${product.image}" alt="${product.name}" />` : imagePlaceholder}
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" product-id="${product.id}">Add to Cart</button>
    `;
    productsList.appendChild(productElement);
  });

  document.querySelectorAll('.add-to-cart').forEach((button) =>
    button.addEventListener('click', function (event) {
      addToCart([
        {
          productId: Number(event.target.getAttribute('product-id')),
          quantity: 1,
        },
      ]);
    })
  );
}

function addEventListeners() {
  document.getElementById('search').addEventListener('input', (event) => {
    filters.search = event.target.value;
    pagination.page = 1; // Reset to first page
    fetchProducts();
  });

  document.getElementById('sorting').addEventListener('change', (event) => {
    const [key, value] = event.target.value.split(':');
    filters[key] = value;
    fetchProducts();
  });

  const minPriceInput = document.getElementById('price-min');
  const maxPriceInput = document.getElementById('price-max');
  document.getElementById('apply-price-filter').addEventListener('click', () => {
    filters.price_gte = minPriceInput.value;
    filters.price_lte = maxPriceInput.value;
    pagination.page = 1;

    fetchProducts();
  });
  [minPriceInput, maxPriceInput].forEach((input) => {
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        filters.price_gte = minPriceInput.value;
        filters.price_lte = maxPriceInput.value;
        pagination.page = 1;

        fetchProducts();
      }
    });
  });
}

function addToCart(productsData) {
  return customFetch('/api/carts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productsData),
  });
}

async function fetchCategories() {
  const response = await customFetch('/api/product-categories');
  const data = await response.json();

  const categoriesFilter = document.getElementById('categories-filter');
  categoriesFilter.innerHTML = '<h3 class="filter-title">Categories</h3>';

  if (!data?.productCategories?.length) {
    const noCategoriesTextElement = document.createElement('div');
    noCategoriesTextElement.innerHTM = '<p>No categories found</p>';
    categoriesFilter.appendChild(noCategoriesTextElement);
    return;
  }

  data?.productCategories?.forEach((category) => {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('checkbox-filter-item');
    categoryElement.innerHTML = `
        <label class="checkbox-filter-label">
            <input type="checkbox" class="category-filter" value="${category.id}" />
            ${category.name}
        </label>
    `;
    categoriesFilter.appendChild(categoryElement);
  });

  document.querySelectorAll('.category-filter').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      filters.category_ids = JSON.stringify(
        Array.from(document.querySelectorAll('.category-filter:checked')).map((checkbox) => Number(checkbox.value))
      );
      pagination.page = 1;
      fetchProducts();
    });
  });
}

async function fetchManufacturers() {
  const response = await customFetch('/api/manufacturers');
  const data = await response.json();

  const manufacturersFilter = document.getElementById('manufacturers-filter');
  manufacturersFilter.innerHTML = '<h3 class="filter-title">Manufacturers</h3>';

  if (!data?.manufacturers?.length) {
    const noManufacturersTextElement = document.createElement('div');
    noManufacturersTextElement.innerHTM = '<p>No manufacturers found</p>';
    manufacturersFilter.appendChild(noManufacturersTextElement);
    return;
  }

  data?.manufacturers?.forEach((manufacturer) => {
    const manufacturerElement = document.createElement('div');
    manufacturerElement.classList.add('checkbox-filter-item');
    manufacturerElement.innerHTML = `
        <label class="checkbox-filter-label">
            <input type="checkbox" class="manufacturer-filter" value="${manufacturer.id}" />
            ${manufacturer.name}
        </label>
    `;
    manufacturersFilter.appendChild(manufacturerElement);
  });

  document.querySelectorAll('.manufacturer-filter').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      filters.manufacturer_ids = JSON.stringify(
        Array.from(document.querySelectorAll('.manufacturer-filter:checked')).map((checkbox) => Number(checkbox.value))
      );
      pagination.page = 1;
      fetchProducts();
    });
  });
}
