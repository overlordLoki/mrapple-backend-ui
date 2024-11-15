import { Order, OrderItem, Product, User, RegisterRequest, LoginRequest, LoginResponse, CreateOrderRequest, 
    OrdersNotFoundResponse, ApiErrorResponse } from './Types';

// const URL = "https://python-api-z0j4.onrender.com/"
const URL = "https://dynamic-flow-production.up.railway.app/"
// Utility function to handle JSON response and errors
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json() as ApiErrorResponse;
        throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
}

// Register a new user
export const registerUser = async (user: RegisterRequest): Promise<User> => {
    const response = await fetch(`${URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return handleResponse(response);
};

// Login a user
export const loginUser = async (login: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
    });
    return handleResponse(response);
};

// Create a new order
export const createOrder = async (order: CreateOrderRequest): Promise<Order> => {
    const response = await fetch(`${URL}orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    return handleResponse(response);
};

// Get an order by ID
export const getOrderById = async (orderId: number): Promise<Order> => {
    const response = await fetch(`${URL}orders/${orderId}`);
    return handleResponse(response);
};

// Get all orders for a user
export const getOrdersForUser = async (userId: number): Promise<Order[] | OrdersNotFoundResponse> => {
    const response = await fetch(`${URL}orders/user/${userId}`);
    return handleResponse(response);
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${URL}products`);
    return handleResponse(response);
};

// Get user details by ID
export const getUserDetails = async (userId: number): Promise<User> => {
    const response = await fetch(`${URL}user/${userId}`);
    return handleResponse(response);
};

// Delete an order
export const deleteOrder = async (orderId: number) => {
    try {
        const response = await fetch(`${URL}orders/delete/${orderId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        // Return the response data directly if successful
        return await response.json();
    } catch (error: any) {
        console.error('Delete order error:', error);
        throw new Error(error.message);
    }
};




// Get items of an order
export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    const response = await fetch(`${URL}orders/${orderId}/items`);
    return handleResponse(response);
};
