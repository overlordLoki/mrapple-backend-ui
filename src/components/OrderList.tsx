import { useState } from 'react';
import { deleteOrder } from './Api';
import { Order } from './Types'; 

interface OrderListProps {
    orders: Order[];
    onDeleteOrder: (orderId: number) => void;
    onViewInvoice: (order: Order) => void;
}

const OrderList = ({ orders, onDeleteOrder, onViewInvoice }: OrderListProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDeleteOrder = async (orderId: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this order?');
        if (!confirmed) return;

        try {
            const response = await deleteOrder(orderId);
            if (response?.detail) { // Check for 'detail' in the response
                onDeleteOrder(orderId);  // Notify parent to update the orders list
            } else {
                throw new Error('Failed to delete order');
            }
        } catch (error: any) {
            console.error('Error handling delete order:', error);
            setErrorMessage(error.message); // Display error if delete fails
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
            )}
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
                                onClick={() => onViewInvoice(order)}
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
    );
};

export default OrderList;
