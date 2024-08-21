import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure useAuth is correctly imported
import UserDetailsModal from '../admincomponents/UserDetailsModal'; // Import the modal component
import '../css/users.css'; // This should be the shared CSS that includes styles for tables

const UsersTable = ({ users, selectedUsers, toggleUserSelection, toggleSelectAll, selectAll, deleteUser }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userOrders, setUserOrders] = useState([]); // State to hold orders of the selected user

    const { authToken } = useAuth(); // Access authToken using the useAuth hook

    const openModal = async (user) => {
        setSelectedUser(user);
        await fetchUserOrders(user.id); // Fetch the orders for the selected user
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setUserOrders([]); // Clear the orders when the modal is closed
    };

    const fetchUserOrders = async (userId) => {
        try {
            const response = await fetch(`https://localhost:7213/api/Order/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setUserOrders(data); // Update the orders state with the fetched data
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    return (
        <>
            <table className="users-table"> {/* Same class as used in OrdersTable */}
                <thead>
                    <tr>
                        <th>
                            <input 
                                type="checkbox" 
                                checked={selectAll} 
                                onChange={toggleSelectAll} 
                            />
                        </th>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>User Details</th> {/* New column for Items */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user.id)} 
                                    onChange={() => toggleUserSelection(user.id)} 
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button 
                                    className="delete-button" 
                                    onClick={() => openModal(user)}
                                >
                                    View
                                </button>
                            </td>
                            <td>
                                <button 
                                    className="delete-button" 
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </button>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Render the modal if a user is selected */}
            {selectedUser && (
                <UserDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    user={selectedUser}
                    orders={userOrders} // Pass the fetched orders to the modal
                />
            )}
        </>
    );
};

export default UsersTable;