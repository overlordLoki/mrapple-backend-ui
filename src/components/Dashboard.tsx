import React, { useEffect, useState } from 'react';
import InvoiceModal from './InvoiceModal'; // Import the Invoice Modal Component

const URL = 'https://mrapple-backend.overlord-loki.com/';  // Your API base URL

const Dashboard = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [productId, setProductId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [makingOrder, setMakingOrder] = useState<boolean>(false);
    const [products, setProducts] = useState<any[]>([]);
    const [showInvoice, setShowInvoice] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const userId = 1;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${URL}orders/user/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch orders');
                
                const data = await response.json();
                setOrders(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchOrders();
    }, [userId]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${URL}products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                
                const data = await response.json();
                setProducts(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    const handleDeleteOrder = async (orderId: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this order?');
        if (!confirmed) return;

        try {
            const response = await fetch(`${URL}orders/delete/${orderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete order');

            setOrders(orders.filter(order => order.order_id !== orderId));
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setMakingOrder(true);

        const selectedProduct = products.find(p => p.productId === productId);
        if (!selectedProduct) {
            alert("Please select a valid product.");
            setMakingOrder(false);
            return;
        }

        const newOrder = {
            user_id: userId,
            order_date: new Date().toISOString(),
            status: 'pending',
            total_amount: quantity * selectedProduct.price,
            order_items: [
                {
                    product_id: productId,
                    quantity,
                    price_each: selectedProduct.price,
                },
            ],
        };

        try {
            const response = await fetch(`${URL}orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) throw new Error('Failed to create order');
            
            const createdOrder = await response.json();
            setOrders((prevOrders) => [...prevOrders, createdOrder]);
            setProductId(0);
            setQuantity(1);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setMakingOrder(false);
        }
    };

    const handleViewInvoice = (order: any) => {
        setSelectedOrder(order);
        setShowInvoice(true);
    };

    return (
        <div className="min-h-screen bg-cover bg-center p-6">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Create Order Form */}
            <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md mb-6">
                <h3 className="font-bold text-3xl text-center mb-6">Create New Order</h3> {/* Title size increased */}
                <form onSubmit={handleCreateOrder}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="productId" className="block text-sm">Product</label>
                            <select
                                id="productId"
                                value={productId}
                                onChange={(e) => setProductId(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
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

                        <div>
                            <label htmlFor="quantity" className="block text-sm">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded mt-1"
                                min="1"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={makingOrder}
                            className={`w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 ${makingOrder ? 'opacity-50' : ''}`}
                        >
                            {makingOrder ? 'Creating Order...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Display Orders */}
            <div className="max-w-3xl mx-auto space-y-4">
                {orders.length === 0 ? (
                    <p className="text-center">No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.order_id} className="bg-white border border-gray-300 p-4 rounded shadow-md flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">Order ID: {order.order_id}</h3>
                                <p>Status: {order.status}</p>
                                <p>Total Amount: ${order.total_amount}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleViewInvoice(order)}
                                    className="bg-green-800 text-white py-1 px-3 rounded hover:bg-green-700"
                                >
                                    View Invoice
                                </button>
                                <button
                                    onClick={() => handleDeleteOrder(order.order_id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                >
                                    Delete Order
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Invoice Modal */}
            {showInvoice && selectedOrder && (
                <InvoiceModal 
                    order={selectedOrder} 
                    user={{ name: 'John Doe' }} 
                    onClose={() => setShowInvoice(false)} 
                />
            )}
        </div>
    );
};

export default Dashboard;
