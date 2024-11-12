import { useState } from 'react';
import { OrderItem, Product, User, CreateOrderRequest } from './Types';

interface OrderFormProps {
    products: Product[];
    handleCreateOrder: (orderData: CreateOrderRequest) => void;
    user: User;
}

const OrderForm = ({ products, handleCreateOrder, user }: OrderFormProps) => {
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    const handleChangeQuantity = (productId: number, quantity: number) => {
        setSelectedItems((prev) => {
            const updatedItems = [...prev];
            const index = updatedItems.findIndex((item) => item.product_id === productId);
            if (index === -1) {
                const product = products.find((p) => p.product_id === productId);
                updatedItems.push({ product_id: productId, quantity, price_each: product ? product.price : 0 });
            } else {
                updatedItems[index].quantity = quantity;
            }
            return updatedItems;
        });
    };

    const handleSubmit = () => {
        const orderData: CreateOrderRequest = {
            user_id: user.user_id,
            order_date: new Date().toISOString(),
            status: 'pending',
            total_amount: selectedItems.reduce((total, item) => {
                const product = products.find((p) => p.product_id === item.product_id);
                return total + (product ? product.price * item.quantity : 0);
            }, 0),
            order_items: selectedItems.map((item) => {
                const product = products.find((p) => p.product_id === item.product_id);
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_each: product ? product.price : 0,
                };
            }),
        };

        handleCreateOrder(orderData);
    };

    return (
        <div className="bg-white p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Create Order</h2>
            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.product_id} className="flex items-center">
                        <div className="flex-1">
                            <h3 className="text-lg">{product.product_name} 🍏</h3>
                            <p className="text-gray-500">${product.price}</p>
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={
                                selectedItems.find((item) => item.product_id === product.product_id)?.quantity || 0
                            }
                            onChange={(e) => handleChangeQuantity(product.product_id, parseInt(e.target.value))}
                            className="w-16 p-2 border rounded"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition duration-200"
            >
                Submit Order
            </button>
        </div>
    );
};

export default OrderForm;
