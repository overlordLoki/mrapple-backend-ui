import React from 'react';
import { jsPDF } from 'jspdf';
import { Order, OrderItem, User, Product } from '../../components/Types';

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
    const orderItemsWithName = orderItems.map((item) => {
        const product = products.find(p => p.product_id === item.product_id);
        return {
            ...item,
            product_name: product ? product.product_name : 'Unknown'
        };
    });

    // Calculate Subtotal, GST, and Total
    const subtotal = orderItemsWithName.reduce((acc, item) => acc + item.quantity * item.price_each, 0);
    const gstAmount = subtotal * 0.15;
    const total = subtotal + gstAmount;

    const handleSaveAsPDF = () => {
        const doc = new jsPDF();

        // Supplier details
        const supplierDetails = {
            name: user.user_name,
            address: user.address,
            contact: user.email,
        };

        // Exporter details
        const exporterDetails = {
            name: 'Mr Apple',
            address: 'Whakatu, Hastings',
            contact: 'office@mrapple.com',
        };

        // Payment details
        const paymentDetails = {
            method: 'Bank Transfer',
            accountName: 'Mr Apple Ltd.',
            accountNumber: '123-456-789',
            dueDate: 'Payment Due: Within 14 days from delivery date.',
        };

        // Add invoice header with supplier and exporter details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16); // Set default font size for titles
        doc.text(`Invoice: ${order.order_id}`, 20, 20);

        // Supplier Details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Set title font size
        doc.text('Supplier Details:', 20, 40);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10); // Set normal text size
        doc.text(`Name: ${supplierDetails.name}`, 20, 50);
        doc.text(`Address: ${supplierDetails.address}`, 20, 60);
        doc.text(`Contact: ${supplierDetails.contact}`, 20, 70);

        // Exporter Details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Set title font size
        doc.text('Exporter Details:', 120, 40);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10); // Set normal text size
        doc.text(`Name: ${exporterDetails.name}`, 120, 50);
        doc.text(`Address: ${exporterDetails.address}`, 120, 60);
        doc.text(`Contact: ${exporterDetails.contact}`, 120, 70);

        // Table headers
        const startY = 90;
        const colWidth = [50, 40, 40, 40, 40]; // Column widths for the table
        const rowHeight = 10;
        const headers = ['Product', 'Quantity', 'Unit Price', 'Subtotal', 'GST (15%)'];

        // Header
        headers.forEach((header, idx) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10); // Set header font size
            doc.text(header, 20 + colWidth[idx] * idx, startY);
        });

        // Add table rows
        let yPos = startY + rowHeight;
        orderItemsWithName.forEach((item) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10); // Set normal text size
            doc.text(item.product_name, 20, yPos);
            doc.text(`${item.quantity}`, 20 + colWidth[0], yPos);
            doc.text(`$${item.price_each.toFixed(2)}`, 20 + colWidth[0] + colWidth[1], yPos);
            doc.text(`$${(item.quantity * item.price_each).toFixed(2)}`, 20 + colWidth[0] + colWidth[1] + colWidth[2], yPos);
            doc.text(`$${(item.quantity * item.price_each * 0.15).toFixed(2)}`, 20 + colWidth[0] + colWidth[1] + colWidth[2] + colWidth[3], yPos);
            yPos += rowHeight;
        });

        // Add Subtotal, GST, and Total at the bottom
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10); // Set normal font size
        doc.text(`Subtotal (Excl. GST): $${subtotal.toFixed(2)}`, 20, yPos + 10);
        doc.text(`GST (15%): $${gstAmount.toFixed(2)}`, 20, yPos + 20);
        doc.text(`Invoice Total (Incl. GST): $${total.toFixed(2)}`, 20, yPos + 30);

        // Add a gap before Payment Details
        doc.text('', 20, yPos + 40);

        // Payment Details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10); // Set normal text size for consistency
        doc.text('Please pay with bank account details below:', 20, yPos + 50);
        doc.text(`Account Name: ${paymentDetails.accountName}`, 20, yPos + 60);
        doc.text(`Account Number: ${paymentDetails.accountNumber}`, 20, yPos + 70);

        // Add gap before Payment Due
        doc.text('', 20, yPos + 80);

        doc.text(paymentDetails.dueDate, 20, yPos + 90);

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
                </div>

                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left font-bold text-sm">Product</th>
                            <th className="border p-2 text-left font-bold text-sm">Unit Price</th>
                            <th className="border p-2 text-left font-bold text-sm">Quantity</th>
                            <th className="border p-2 text-left font-bold text-sm">Subtotal</th>
                            <th className="border p-2 text-left font-bold text-sm">GST (15%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItemsWithName && orderItemsWithName.length > 0 ? (
                            orderItemsWithName.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-2 text-sm">{item.product_name}</td>
                                    <td className="border p-2 text-sm">${item.price_each.toFixed(2)}</td>
                                    <td className="border p-2 text-sm">{item.quantity}</td>
                                    <td className="border p-2 text-sm">${(item.quantity * item.price_each).toFixed(2)}</td>
                                    <td className="border p-2 text-sm">${(item.quantity * item.price_each * 0.15).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-4">No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-4">
                    <p><strong>Subtotal (excl. GST):</strong> ${subtotal.toFixed(2)}</p>
                    <p><strong>GST (15%):</strong> ${gstAmount.toFixed(2)}</p>
                    <p><strong>Invoice Total (incl. GST):</strong> ${total.toFixed(2)}</p>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={handleSaveAsPDF} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">
                        Save as PDF
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
