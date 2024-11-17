import React from 'react';
import { jsPDF } from 'jspdf';
import { Order, OrderItem, User, Product } from '../Types';

interface InvoiceProps {
    order: Order;
    user: User;
    onClose: () => void;
    products: Product[];
}

const InvoiceModal: React.FC<InvoiceProps> = ({ order, user, onClose, products }) => {
    if (!order || !user) {
        return <p>Loading...</p>;
    }

    const orderItems: OrderItem[] = order.items;
    // Match product id with product name
    const orderItemsWithName = orderItems.map((item) => {
        const product = products.find(p => p.product_id === item.product_id);
        return {
            ...item,
            product_name: product ? product.product_name : 'Unknown'
        };
    });

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();

        // Add invoice header
        doc.setFont('helvetica', 'bold');
        doc.text(`Invoice: ${order.order_id}`, 20, 20);
        doc.setFont('helvetica', 'normal');
        doc.text(`User: ${user.user_name}`, 20, 30);
        doc.text(`Total Amount: $${order.total_amount.toFixed(2)}`, 20, 40);

        // Add table headers
        const startY = 50;
        const colWidth = [50, 40, 40, 40, 40]; // Example column widths for the table
        const rowHeight = 10;
        const headers = ['Product', 'Quantity', 'Price Each', 'Total', 'GST (15%)'];
        
        // Header
        headers.forEach((header, idx) => {
            doc.text(header, 20 + colWidth[idx] * idx, startY);
        });

        // Add table rows
        let yPos = startY + rowHeight;
        orderItemsWithName.forEach((item) => {
            doc.text(item.product_name, 20, yPos);
            doc.text(`${item.quantity}`, 20 + colWidth[0], yPos);
            doc.text(`$${item.price_each.toFixed(2)}`, 20 + colWidth[0] + colWidth[1], yPos);
            doc.text(`$${(item.quantity * item.price_each).toFixed(2)}`, 20 + colWidth[0] + colWidth[1] + colWidth[2], yPos);
            doc.text(`$${(item.quantity * item.price_each * 0.15).toFixed(2)}`, 20 + colWidth[0] + colWidth[1] + colWidth[2] + colWidth[3], yPos);
            yPos += rowHeight;
        });

        // Save as PDF
        doc.save(`Invoice_${order.order_id}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Invoice</h2>

                <div className="mb-4">
                    <p><strong>Order Number:</strong> {order.order_id}</p>
                    <p><strong>User:</strong> {user.user_name}</p>
                    <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
                </div>

                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Product</th>
                            <th className="border p-2 text-left">Quantity</th>
                            <th className="border p-2 text-left">Price Each</th>
                            <th className="border p-2 text-left">Total</th>
                            <th className="border p-2 text-left">GST (15%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItemsWithName && orderItemsWithName.length > 0 ? (
                            orderItemsWithName.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2">{item.product_name}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                    <td className="border p-2">${item.price_each.toFixed(2)}</td>
                                    <td className="border p-2">${(item.quantity * item.price_each).toFixed(2)}</td>
                                    <td className="border p-2">${(item.quantity * item.price_each * 0.15).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-4">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={handleSaveAsPDF} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Save as PDF
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
