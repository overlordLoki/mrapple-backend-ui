// src/components/Types.ts
export interface OrderItem {
    product_id: number;
    quantity: number;
    price_each: number;
}

export interface Order {
    order_id: number;
    user_id: number;
    status: string;
    total_amount: number;
    order_date: string; // You can use a string or Date if you parse it
    items: OrderItem[];
}

export interface Product {
    product_id: number;
    product_name: string;
    description: string;
    price: number;
}

export interface User {
    user_id: number;
    user_name: string;
    address: string;
    email: string;  // Add email to user details
}
//
// API Response Types
//
export interface RegisterRequest {
    user_name: string;
    password: string;
    address: string;
    email: string;  // Add email to request
}

export interface LoginRequest {
    user_name: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    user_id: number;
}

export interface CreateOrderRequest {
    user_id: number;
    order_date: string;
    status: string;
    total_amount: number;
    order_items: OrderItem[];  // This should stay as an array of OrderItem
}

export interface OrdersNotFoundResponse {
    detail: string; // Example: "No orders found for this user"
}

export interface DeleteOrderResponse {
    detail: string; // Example: "Order 1 successfully deleted"
}

export interface ApiErrorResponse {
    error: string;
    message: string;
}
