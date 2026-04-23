'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CustomerData {
  id: number; firstName: string; lastName: string; email: string;
  phone?: string; address?: string; city?: string; postalCode?: string; country?: string;
}

interface CustomerAuthState {
  token: string | null;
  customer: CustomerData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthState | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('customer_token');
    const c = localStorage.getItem('customer_data');
    if (t) { setToken(t); if (c) setCustomer(JSON.parse(c)); }
  }, []);

  const saveAuth = (t: string, c: CustomerData) => {
    localStorage.setItem('customer_token', t);
    localStorage.setItem('customer_data', JSON.stringify(c));
    setToken(t); setCustomer(c);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/auth/customer/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Login failed'); }
    const data = await res.json();
    saveAuth(data.token, data.customer);
  };

  const register = async (formData: Record<string, string>) => {
    const res = await fetch('/api/v1/auth/customer/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Registration failed'); }
    const data = await res.json();
    saveAuth(data.token, data.customer);
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    setToken(null); setCustomer(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    const res = await fetch('/api/v1/auth/customer/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) { const c = await res.json(); setCustomer(c); localStorage.setItem('customer_data', JSON.stringify(c)); }
  };

  return (
    <CustomerAuthContext.Provider value={{ token, customer, isAuthenticated: !!token, login, register, logout, refreshProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be inside CustomerAuthProvider');
  return ctx;
}

