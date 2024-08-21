import React from 'react';
import '../css/modal.css'; // Import appropriate styles

const UserDetailsModal = ({ isOpen, onClose, user, orders }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>User Details</h2>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <h3>Orders</h3>
                {orders.length > 0 ? (
                    <ul>
                        {orders.map(order => (
                            <li key={order.orderId}>
                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                                <h4>Items:</h4>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.itemId}>
                                            {item.productName} - {item.quantity} x ${item.price}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No orders found for this user.</p>
                )}
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default UserDetailsModal;
