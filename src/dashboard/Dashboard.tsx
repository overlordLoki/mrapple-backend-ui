import { useEffect, useState } from 'react';
import InvoiceModal from './orders/InvoiceModal';
import OrderForm from './orders/OrderForm';
import OrderList from './orders/OrderList';
import Products from './orders/Products'; // Import the new Products component
import { Order, Product, User } from '../components/Types';
import { getOrdersForUser, getProducts, createOrder, getUserDetails } from '../components/Api';

interface DashboardProps {
    userId: number;
}

const Dashboard = ({ userId }: DashboardProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [showInvoice, setShowInvoice] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Set user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserDetails(userId);
                setUser(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (user?.user_id !== undefined) {
                    const data = await getOrdersForUser(user.user_id);
                    if (Array.isArray(data)) {
                        setOrders(data); // Data will be an empty array if no orders are found
                    } else {
                        setError('No orders found');
                    }
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    // Handle viewing invoice
    const handleViewInvoice = (order: Order) => {
        setSelectedOrder(order);
        setShowInvoice(true);
    };

    // Handle creating an order
    const handleCreateOrder = async (orderData: any) => {
        try {
            const newOrder = await createOrder(orderData);
            setOrders((prevOrders) => [newOrder, ...prevOrders]); // Add the new order to the list
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center p-6" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Order Section */}
                <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Create New Order</h2>
                    <OrderForm 
                        products={products} 
                        handleCreateOrder={handleCreateOrder} 
                        user={user!}
                    />
                </div>

                {/* View Orders Section */}
                <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-lg border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Your Orders</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <OrderList
                        orders={orders}
                        onViewInvoice={handleViewInvoice}
                        onDeleteOrder={(orderId: number) => {
                            // Handle deletion by filtering out the deleted order from the state
                            setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
                        }}
                    />
                </div>
            </div>

            {/* Product List with transparency */}
            <div className="container mx-auto grid grid-cols-1 col-span-2 md:grid-cols-2 gap-6 mt-6">
                <div className="col-span-2">
                    <Products products={products} />
                </div>
            </div>

            {showInvoice && selectedOrder && user && (
                <InvoiceModal 
                    order={selectedOrder} 
                    user={user} 
                    onClose={() => setShowInvoice(false)}
                    products={products}
                />
            )}
        </div>
    );
};

export default Dashboard;
