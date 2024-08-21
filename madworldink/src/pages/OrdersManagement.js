import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import AdminHeader from "../admincomponents/AdminHeader";
import OrdersTable from "../admincomponents/OrdersTable";
import UsersPagination from "../admincomponents/UsersPagination"; 
import AdminFooter from "../admincomponents/AdminFooter";
import OrdersTableHeader from "../admincomponents/OrdersTableHeader";
import "../css/users.css"; 

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const { authToken, logout } = useAuth(); 
  const navigate = useNavigate(); 

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://localhost:7213/api/Order", {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (authToken) {
      fetchOrders();
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prevState) =>
      prevState.includes(orderId)
        ? prevState.filter((id) => id !== orderId)
        : [...prevState, orderId]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedOrders(selectAll ? [] : orders.map((order) => order.orderId)); 
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`https://localhost:7213/api/Order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(orders.filter((order) => order.orderId !== orderId)); 
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId)); 
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const deleteSelectedOrders = () => {
    selectedOrders.forEach(orderId => deleteOrder(orderId));
    setSelectedOrders([]);
    setSelectAll(false);
  };

  const changeRowsPerPage = (newRowsPerPage) => {
    setRowsPerPage(parseInt(newRowsPerPage));
    setCurrentPage(1); 
  };

  const nextPage = () => {
    const totalPages = Math.ceil(orders.length / rowsPerPage);
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
  const displayedOrders = orders.slice(start, start + rowsPerPage);

  return (
    <>
      <AdminHeader onLogout={handleLogout} />
      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <OrdersTableHeader />
        <OrdersTable
          orders={displayedOrders}
          selectedOrders={selectedOrders}
          toggleOrderSelection={toggleOrderSelection}
          toggleSelectAll={toggleSelectAll}
          selectAll={selectAll}
          deleteOrder={deleteOrder}
        />
        {selectedOrders.length > 0 && (
          <div className="users-footer">
            <span>{`${selectedOrders.length} row(s) selected`}</span>
            <button
              className="delete-all-button"
              onClick={deleteSelectedOrders}
            >
              Delete All
            </button>
          </div>
        )}
        <UsersPagination
          rowsPerPage={rowsPerPage}
          totalRows={orders.length}
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

export default OrdersManagement;
