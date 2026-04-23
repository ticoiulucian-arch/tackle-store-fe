export enum ProductType {
    ROD = 'ROD', REEL = 'REEL', FEEDER = 'FEEDER', LINE = 'LINE',
    HOOK = 'HOOK', NET = 'NET', BAIT = 'BAIT',
    ACCESSORY = 'ACCESSORY', RIG = 'RIG', LEAD = 'LEAD',
}

export enum OrderStatus {
    PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED', DELIVERED = 'DELIVERED', CANCELLED = 'CANCELLED',
}

export interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    productCount: number;
    specTemplate?: string[];
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    brand: string;
    type: ProductType;
    categoryId: number;
    categoryName: string;
    active: boolean;
    specifications: Record<string, string>;
    translations?: Record<string, ProductTranslation>;
}

export interface ProductTranslation {
    name: string;
    description: string;
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    customerId: number;
    customerName: string;
    status: OrderStatus;
    totalAmount: number;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    orderDate: string;
    items: OrderItem[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

