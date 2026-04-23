import {Category, Customer, Order, Page, Product} from '@/types';

const BASE = '/api/v1';

function getLocale(): string {
    if (typeof document === 'undefined') return 'ro';
    return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('locale='))?.split('=')[1] || 'ro';
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const locale = getLocale();
    const res = await fetch(url, {
        ...init,
        headers: { 'Accept-Language': locale, ...init?.headers },
    });
    if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
    return res.json();
}

// Products
export const getProducts = (page = 0, size = 20) =>
    fetchJson<Page<Product>>(`${BASE}/products?page=${page}&size=${size}`);

export const getProduct = (id: number) =>
    fetchJson<Product>(`${BASE}/products/${id}`);

export const getProductsByCategory = (categoryId: number, page = 0, size = 20) =>
    fetchJson<Page<Product>>(`${BASE}/products/category/${categoryId}?page=${page}&size=${size}`);

export const getProductsByType = (type: string, page = 0, size = 20) =>
    fetchJson<Page<Product>>(`${BASE}/products/type/${type}?page=${page}&size=${size}`);

export const searchProducts = (q: string, page = 0, size = 20) =>
    fetchJson<Page<Product>>(`${BASE}/products/search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`);

export const getProductsByPriceRange = (min: number, max: number, page = 0, size = 20) =>
    fetchJson<Page<Product>>(`${BASE}/products/price-range?min=${min}&max=${max}&page=${page}&size=${size}`);

export const filterProducts = (params: Record<string, string>, page = 0, size = 20) => {
    const qs = new URLSearchParams({...params, page: String(page), size: String(size)});
    return fetchJson<Page<Product>>(`${BASE}/products/filter?${qs}`);
};

export const getSpecOptions = (type: string) =>
    fetchJson<Record<string, string[]>>(`${BASE}/products/spec-options?type=${type}`);

// Categories
export const getCategories = () =>
    fetchJson<Category[]>(`${BASE}/categories`);

export const getCategory = (id: number) =>
    fetchJson<Category>(`${BASE}/categories/${id}`);

// Customers
export const createCustomer = (data: Omit<Customer, 'id'>) =>
    fetchJson<Customer>(`${BASE}/customers`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data),
    });

export const getCustomerByEmail = (email: string) =>
    fetchJson<Customer>(`${BASE}/customers/email/${encodeURIComponent(email)}`);

// Orders
export const createOrder = (data: {
    customerId: number;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    items: { productId: number; quantity: number }[]
}) =>
    fetchJson<Order>(`${BASE}/orders`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data),
    });

export const getOrderByNumber = (orderNumber: string) =>
    fetchJson<Order>(`${BASE}/orders/number/${orderNumber}`);

