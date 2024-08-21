// src/admincomponents/UsersPagination.js
import React from 'react';
import '../css/users.css';
const OrdersPagination = ({ rowsPerPage, totalRows, currentPage, changeRowsPerPage, nextPage, previousPage }) => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(start + rowsPerPage - 1, totalRows);

    return (
        <div className="users-pagination">
            <span>Rows per page:</span>
            <select id="rowsPerPage" value={rowsPerPage} onChange={(e) => changeRowsPerPage(e.target.value)}>
                <option value="9">9</option>
                <option value="18">18</option>
                <option value="27">27</option>
            </select>
            <span>{`${start}-${end} of ${totalRows}`}</span>
            <button onClick={previousPage} disabled={currentPage === 1}><i className="bx bx-chevron-left"></i></button>
            <button onClick={nextPage} disabled={currentPage === totalPages}><i className="bx bx-chevron-right"></i></button>
        </div>
    );
};

export default OrdersPagination;
