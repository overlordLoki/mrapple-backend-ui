import React, { useEffect, useState } from 'react';
const URL = 'https://[2407:7000:9bfa:a600:c09:b964:4cfc:d4e0]/';
const Dashboard = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [productId, setProductId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [makingOrder, setMakingOrder] = useState<boolean>(false); // Track if the form is being submitted
    const [products, setProducts] = useState<any[]>([]); // Store products
    const userId = 3; // Set the user ID as per your requirements or authentication state

    // Fetch orders for the user
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${URL}api/orders/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);  // Update the state with fetched orders
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchOrders();
    }, [userId]);

    // Fetch products for the order form
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${URL}api/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);  // Update the state with fetched products
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteOrder = async (orderId: number) => {
        try {
            const response = await fetch(`${URL}api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            setOrders(orders.filter(order => order.orderId !== orderId));
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setMakingOrder(true);

        // Ensure the product is correctly selected
        const selectedProduct = products.find(p => p.productId === productId);
        if (!selectedProduct) {
            alert("Please select a valid product.");
            setMakingOrder(false);
            return;
        }

        const newOrder = {
            userId,
            orderDate: new Date().toISOString(),  // Use the current date and time
            status: 'Pending',  // Default status
            totalAmount: quantity * selectedProduct.price,  // Calculate total amount using correct price
            orderItems: [
                {
                    productId,
                    quantity,
                    priceEach: selectedProduct.price,  // Use correct price for each order item
                },
            ],
        };

        try {
            const response = await fetch(`${URL}api/orders/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const createdOrder = await response.json();
            setOrders((prevOrders) => [...prevOrders, createdOrder]); // Add new order to the state
            setProductId(0); // Reset product ID
            setQuantity(1);  // Reset quantity
        } catch (error: any) {
            alert(error.message);
        } finally {
            setMakingOrder(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Create Order Form */}
            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="font-bold text-lg">Create New Order</h3>
                <form onSubmit={handleCreateOrder}>
                    <div className="space-y-4">
                        {/* Product Selection */}
                        <div>
                            <label htmlFor="productId" className="block text-sm">Product</label>
                            <select
                                id="productId"
                                value={productId}
                                onChange={(e) => setProductId(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value={0}>Select a product</option>
                                {products.map((product) => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName} - ${product.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <label htmlFor="quantity" className="block text-sm">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="1"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={makingOrder}
                            className={`w-full py-2 bg-blue-500 text-white rounded ${makingOrder ? 'opacity-50' : ''}`}
                        >
                            {makingOrder ? 'Creating Order...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Display Orders */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p>No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.orderId} className="border p-4 rounded shadow-md">
                            <h3 className="font-bold">Order ID: {order.orderId}</h3>
                            <p>Status: {order.status}</p>
                            <p>Total Amount: ${order.totalAmount}</p>
                            <button
                                onClick={() => handleDeleteOrder(order.orderId)}
                                className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
                            >
                                Delete Order
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
