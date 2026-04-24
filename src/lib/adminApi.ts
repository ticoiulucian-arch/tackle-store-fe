const BASE = '/api/v1';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...init,
    headers: { ...init?.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// Stats
export const getAdminStats = () => adminFetch<Record<string, number>>(`${BASE}/admin/stats`);

// Products CRUD
export const adminGetProducts = (page = 0, size = 50) =>
  adminFetch<any>(`${BASE}/products?page=${page}&size=${size}`);

export const adminCreateProduct = (data: any) =>
  adminFetch<any>(`${BASE}/products`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });

export const adminUpdateProduct = (id: number, data: any) =>
  adminFetch<any>(`${BASE}/products/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });

export const adminDeleteProduct = (id: number) =>
  adminFetch<void>(`${BASE}/products/${id}`, { method: 'DELETE' });

// Categories CRUD
export const adminGetCategories = () => adminFetch<any[]>(`${BASE}/categories`);
export const adminGetCategoriesFlat = () => adminFetch<any[]>(`${BASE}/categories/flat`);

export const adminCreateCategory = (data: any) =>
  adminFetch<any>(`${BASE}/categories`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });

export const adminUpdateCategory = (id: number, data: any) =>
  adminFetch<any>(`${BASE}/categories/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });

export const adminDeleteCategory = (id: number) =>
  adminFetch<void>(`${BASE}/categories/${id}`, { method: 'DELETE' });

// Orders
export const adminGetOrders = (page = 0) =>
  adminFetch<any>(`${BASE}/orders?page=${page}&size=20`);

export const adminUpdateOrderStatus = (id: number, status: string) =>
  adminFetch<any>(`${BASE}/orders/${id}/status?status=${status}`, { method: 'PUT' });

// Image upload
export const adminUploadImage = async (file: File): Promise<{ url: string }> => {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/admin/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

// Translations
export const adminGetTranslations = (productId: number) =>
  adminFetch<Record<string, { name: string; description: string }>>(`${BASE}/products/${productId}/translations`);

export const adminUpsertTranslation = (productId: number, locale: string, data: { name: string; description: string }) =>
  adminFetch<{ name: string; description: string }>(`${BASE}/products/${productId}/translations/${locale}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });

export const adminDeleteTranslation = (productId: number, locale: string) =>
  adminFetch<void>(`${BASE}/products/${productId}/translations/${locale}`, { method: 'DELETE' });

