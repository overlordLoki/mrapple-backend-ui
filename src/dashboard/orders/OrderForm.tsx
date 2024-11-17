import { useState } from 'react';
import { OrderItem, Product, User, CreateOrderRequest } from '../../components/Types';

interface OrderFormProps {
    products: Product[];
    handleCreateOrder: (orderData: CreateOrderRequest) => void;
    user: User;
}

const OrderForm = ({ products, handleCreateOrder, user }: OrderFormProps) => {
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleChangeQuantity = (productId: number, quantity: number) => {
        setSelectedItems((prev) => {
            const updatedItems = [...prev];
            const index = updatedItems.findIndex((item) => item.product_id === productId);

            if (quantity <= 0) {
                // Remove item if quantity is zero or less
                if (index !== -1) updatedItems.splice(index, 1);
            } else {
                if (index === -1) {
                    const product = products.find((p) => p.product_id === productId);
                    if (product) {
                        updatedItems.push({
                            product_id: productId,
                            quantity,
                            price_each: product.price,
                        });
                    }
                } else {
                    updatedItems[index].quantity = quantity;
                }
            }

            return updatedItems;
        });
    };

    const calculateTotal = () =>
        selectedItems.reduce(
            (total, item) =>
                total +
                item.quantity * (products.find((p) => p.product_id === item.product_id)?.price || 0),
            0
        );

    const handleSubmit = () => {
        if (selectedItems.length === 0) {
            setError('You must select at least one product.');
            return;
        }

        setIsModalOpen(true);
    };

    const confirmOrder = () => {
        const orderData: CreateOrderRequest = {
            user_id: user.user_id,
            order_date: new Date().toISOString(),
            status: 'pending',
            total_amount: calculateTotal(),
            order_items: selectedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price_each: item.price_each,
            })),
        };

        handleCreateOrder(orderData);
        setSelectedItems([]); // Reset form on successful order
        setError(null); // Clear any errors
        setIsModalOpen(false); // Close the modal
    };

    const cancelOrder = () => {
        setIsModalOpen(false); // Close the modal without placing the order
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="space-y-4">
                {products.map((product) => {
                    const selectedQuantity =
                        selectedItems.find((item) => item.product_id === product.product_id)?.quantity || 0;

                    return (
                        <div
                            key={product.product_id}
                            className="flex items-center justify-between border-b pb-2 mb-2"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{product.product_name}</h3>
                                <p className="text-gray-500">${product.price.toFixed(2)}/kg</p>
                            </div>
                            <input
                                type="number"
                                min="0"
                                value={selectedQuantity}
                                onChange={(e) =>
                                    handleChangeQuantity(product.product_id, parseInt(e.target.value, 10) || 0)
                                }
                                className="w-20 p-2 border rounded"
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between mt-4">
                <p className="text-xl font-semibold">Total: ${calculateTotal().toFixed(2)} 
                <span className="text-sm text-gray-500"> (exc GST)</span>
                    </p>
                <button
                    onClick={handleSubmit}
                    className={`px-4 py-2 rounded transition duration-200 ${
                        selectedItems.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                    disabled={selectedItems.length === 0}
                >
                    Submit Order
                </button>
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            Confirm Your Order
                        </h3>
                        <p className="mb-4 text-center text-gray-700">
                            You're about to place an order with a total of{' '}
                            <span className="font-semibold">${calculateTotal().toFixed(2)}</span>.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={confirmOrder}
                                className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={cancelOrder}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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

export default OrderForm;
