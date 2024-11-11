import React from 'react';

interface InvoiceProps {
    order: any;  // Define the shape of the order data
    user: any;   // Define the shape of the user data
    onClose: () => void;  // Function to close the modal
}

const InvoiceModal: React.FC<InvoiceProps> = ({ order, user, onClose }) => {
    // Check if order and user data are available
    if (!order || !user) {
        return <p>Loading...</p>;  // You can customize the loading message
    }

    const handlePrint = () => {
        window.print();  // Opens the print dialog
    };

    // Function to save the invoice as PDF
    const handleSaveAsPDF = () => {
        // Create a new window with the invoice content
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow pop-ups to save the invoice as PDF.');
            return;
        }

        // Set the content of the new window
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h2>Invoice</h2>
                    <p>Order Number: ${order.order_id}</p>
                    <p>User: ${user.name}</p>
                    <p>Total Amount: $${order.total_amount}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price Each</th>
                                <th>Total</th>
                                <th>GST</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.order_items.map((item: any) => `
                                <tr>
                                    <td>${item.product_name}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price_each}</td>
                                    <td>$${(item.quantity * item.price_each).toFixed(2)}</td>
                                    <td>$${(item.quantity * item.price_each * 0.15).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);

        // Close the document after writing the content
        printWindow.document.close();

        // Save the document as PDF
        printWindow.print();
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Invoice</h2>
                <p>Order Number: {order.order_id}</p>
                <p>User: {user.name}</p>
                <p>Total Amount: ${order.total_amount}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price Each</th>
                            <th>Total</th>
                            <th>GST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item: any) => (
                                <tr key={item.product_id}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price_each}</td>
                                    <td>${(item.quantity * item.price_each).toFixed(2)}</td>
                                    <td>${(item.quantity * item.price_each * 0.15).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <button onClick={handlePrint}>Print Invoice</button>
                    <button onClick={handleSaveAsPDF}>Save as PDF</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
