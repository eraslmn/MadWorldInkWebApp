import React from 'react';
import '../css/modal.css'; // Add appropriate CSS for the modal

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>User ID:</strong> {order.userId}</p>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount}</p>

                <h3>Items</h3>
                <ul>
                    {order.items.map((item, index) => (
                        <li key={index}>
                            <p><strong>Product Name:</strong> {item.productName}</p>
                            <p><strong>Quantity:</strong> {item.quantity}</p>
                            <p><strong>Price:</strong> ${item.price}</p>
                        </li>
                    ))}
                </ul>

                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
