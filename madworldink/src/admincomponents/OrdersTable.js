import React, { useState } from 'react';
import OrderDetailsModal from '../admincomponents/OrderDetailsModal'; // Import the modal component
import '../css/users.css';

const OrdersTable = ({ orders, selectedOrders, toggleOrderSelection, toggleSelectAll, selectAll, deleteOrder }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                checked={selectAll} 
                                onChange={toggleSelectAll} 
                            />
                        </th>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId}> {/* Ensure each row has a unique key */}
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedOrders.includes(order.orderId)} 
                                    onChange={() => toggleOrderSelection(order.orderId)} 
                                />
                            </td>
                            <td>{order.orderId}</td> {/* Display Order ID */}
                            <td>{order.userId}</td> {/* Display User ID */}
                            <td>{new Date(order.orderDate).toLocaleString()}</td> {/* Format date for better readability */}
                            <td>{order.totalAmount}</td>
                            <td>
                                <button 
                                    className="delete-button" 
                                    onClick={() => openModal(order)}
                                >
                                    View
                                </button>
                            </td>
                            <td>
                                <button 
                                    className="delete-button" 
                                    onClick={() => deleteOrder(order.orderId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    order={selectedOrder}
                />
            )}
        </>
    );
};

export default OrdersTable;
