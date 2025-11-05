import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Shops API
export const fetchShops = () => API.get('/shops');
export const createShop = (shopData) => API.post('/shops', shopData);
export const updateShop = (id, shopData) => API.put(`/shops/${id}`, shopData);
export const deleteShop = (id) => API.delete(`/shops/${id}`);

// Products API
export const fetchProducts = () => API.get('/products');
export const createProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Sales API
export const fetchSales = () => API.get('/sales');
export const createSale = (saleData) => API.post('/sales', saleData);
export const getSaleByBillNo = (billNo) => API.get(`/sales/${billNo}`);
export const getSalesByShop = (shopId) => API.get(`/sales/shop/${shopId}`);
export const printAndSendBill = (billNo, phoneNumber) => 
  API.post(`/sales/print/${billNo}`, null, { params: { phoneNumber } });