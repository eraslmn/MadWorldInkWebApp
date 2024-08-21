import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminHeader from '../admincomponents/AdminHeader';
import UsersTableHeader from '../admincomponents/UsersTableHeader';
import UsersTable from '../admincomponents/UsersTable';
import UsersPagination from '../admincomponents/UsersPagination';
import AdminFooter from '../admincomponents/AdminFooter';
import '../css/users.css';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectAll, setSelectAll] = useState(false);

    const { authToken, logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
        } else {
            fetchUsers(); 
        }
    }, [authToken, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7213/api/Auth/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data); 
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`https://localhost:7213/api/Auth/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter(user => user.id !== userId));
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prevState => 
            prevState.includes(userId) 
                ? prevState.filter(id => id !== userId) 
                : [...prevState, userId]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user.id)); 
        }
        setSelectAll(!selectAll);
    };

    const deleteSelectedUsers = () => {
        selectedUsers.forEach(userId => deleteUser(userId));
        setSelectedUsers([]);
        setSelectAll(false);
    };

    const changeRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(parseInt(newRowsPerPage));
        setCurrentPage(1); 
    };

    const nextPage = () => {
        const totalPages = Math.ceil(users.length / rowsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const start = (currentPage - 1) * rowsPerPage;
    const displayedUsers = users.slice(start, start + rowsPerPage);

    return (
        <>
            <AdminHeader onLogout={handleLogout} />
            <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <UsersTableHeader />
                <UsersTable 
                    users={displayedUsers} 
                    selectedUsers={selectedUsers} 
                    toggleUserSelection={toggleUserSelection} 
                    toggleSelectAll={toggleSelectAll}
                    selectAll={selectAll}
                    deleteUser={deleteUser}
                />
                {selectedUsers.length > 0 && (
                    <div className="users-footer">
                        <span>{`${selectedUsers.length} row(s) selected`}</span>
                        <button
                            className="delete-all-button"
                            onClick={deleteSelectedUsers}
                        >
                            Delete All
                        </button>
                    </div>
                )}
                <UsersPagination 
                    rowsPerPage={rowsPerPage}
                    totalRows={users.length}
                    currentPage={currentPage}
                    changeRowsPerPage={changeRowsPerPage}
                    nextPage={nextPage}
                    previousPage={previousPage}
                />
            </main>
            <AdminFooter />
        </>
    );
};

export default UsersManagement;
