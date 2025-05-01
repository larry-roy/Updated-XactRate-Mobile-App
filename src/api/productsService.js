import URL_CONFIG from '../Components/global-config';

// api/products.js
const API_CONFIG = {
  BASE_URL: URL_CONFIG.Url,
  ENDPOINTS: {
    PRODUCTS: 'api/catalog/product',
  },
};

async function fetchProductsApi(catalogId, categoryId, page, userToken) {
  try {
    if (!userToken) throw new Error('User token not found');

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    };

    const url =
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}` +
      `?catalog_id=${catalogId}&catalog_category_id=${categoryId}&page=${page}`;

    const response = await fetch(url, {method: 'GET', headers});
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

export {fetchProductsApi};
