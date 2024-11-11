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
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { text-align: center; }
                        .invoice-details { margin: 20px 0; }
                        .invoice-details p { margin: 5px 0; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        td { font-size: 14px; }
                        .footer { margin-top: 30px; text-align: center; }
                        .button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; }
                        .button:hover { background-color: #45a049; }
                    </style>
                </head>
                <body>
                    <h2>Invoice</h2>
                    <div class="invoice-details">
                        <p><strong>Order Number:</strong> ${order.order_id}</p>
                        <p><strong>User:</strong> ${user.name}</p>
                        <p><strong>Total Amount:</strong> $${order.total_amount}</p>
                    </div>
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
                    <div class="footer">
                        <button class="button" onclick="window.print()">Print Invoice</button>
                        <button class="button" onclick="window.print()">Save as PDF</button>
                    </div>
                </body>
            </html>
        `);

        // Close the document after writing the content
        printWindow.document.close();

        // Save the document as PDF
        printWindow.print();
    }

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '800px', width: '100%' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Invoice</h2>
                <div style={{ marginBottom: '16px' }}>
                    <p><strong>Order Number:</strong> {order.order_id}</p>
                    <p><strong>User:</strong> {user.name}</p>
                    <p><strong>Total Amount:</strong> ${order.total_amount}</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Product</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Quantity</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Price Each</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Total</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>GST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.product_name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.price_each}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${(item.quantity * item.price_each).toFixed(2)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${(item.quantity * item.price_each * 0.15).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '8px' }}>No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div style={{ textAlign: 'center' }}>
                    <button onClick={handlePrint} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                        Print Invoice
                    </button>
                    <button onClick={handleSaveAsPDF} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                        Save as PDF
                    </button>
                    <button onClick={onClose} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
