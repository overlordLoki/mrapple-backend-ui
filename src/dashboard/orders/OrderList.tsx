import { useState } from 'react';
import { deleteOrder, email } from '../../components/Api';
import { Order } from '../../components/Types';

interface OrderListProps {
    orders: Order[];
    onDeleteOrder: (orderId: number) => void;
    onViewInvoice: (order: Order) => void;
}

const OrderList = ({ orders, onDeleteOrder, onViewInvoice }: OrderListProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isEmailSending, setIsEmailSending] = useState(false); // State for email sending
    const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null); // Success message for email

    const handleDeleteOrder = async (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedOrderId) return;

        try {
            const response = await deleteOrder(selectedOrderId);
            if (response?.detail) {
                onDeleteOrder(selectedOrderId); // Notify parent to update the orders list
                setIsModalOpen(false); // Close the modal after successful deletion
                setErrorMessage(null); // Clear any previous error message
            } else {
                throw new Error('Failed to delete order');
            }
        } catch (error: any) {
            console.error('Error handling delete order:', error);
            setErrorMessage(error.message); // Display error if delete fails
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Close modal without deleting
        setSelectedOrderId(null); // Clear selected order
    };

    const handleSendEmail = async (orderId: number) => {
        setIsEmailSending(true);
        setEmailSuccessMessage(null); // Reset success message
        try {
            const response = await email(orderId);
            setEmailSuccessMessage(response.message); // Show success message
        } catch (error: any) {
            setErrorMessage(error.message); // Display error if email sending fails
        } finally {
            setIsEmailSending(false); // Reset the loading state
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            {emailSuccessMessage && (
                <p className="text-green-500 text-center">{emailSuccessMessage}</p>
            )}

            <div className="max-h-[37rem] rounded-lg overflow-y-auto space-y-4">
                {orders.length === 0 ? (
                    <p className="text-center">No orders found</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.order_id}
                            className="bg-white border border-gray-300 p-2 rounded-lg shadow-md flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold">Order ID: {order.order_id}</h3>
                                <p>Status: {order.status}</p>
                                <p>Total Amount: ${order.total_amount.toFixed(2)}</p>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => onViewInvoice(order)}
                                    className="bg-green-700 text-white py-1 px-3 rounded hover:bg-green-600"
                                >
                                    View Invoice
                                </button>
                                <button
                                    onClick={() => handleSendEmail(order.order_id)}
                                    disabled={isEmailSending}
                                    className={`bg-blue-500 text-white py-1 px-3 rounded ${isEmailSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                                >
                                    {isEmailSending ? 'Sending...' : 'Send Invoice Email'}
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

            {/* Custom Modal for Delete Confirmation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Confirm Deletion
                        </h3>
                        <p className="mb-4 text-center text-gray-700">
                            Are you sure you want to delete Order ID: {selectedOrderId}?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
