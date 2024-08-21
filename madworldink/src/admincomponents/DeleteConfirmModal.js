import React from 'react';
import '../css/products.css'; 

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <p>Are you sure you want to delete this product permanently? This action cannot be undone.</p>
                <button onClick={onConfirm} className="confirm-delete">Yes</button>
                <button onClick={onClose} className="cancel-delete">Cancel</button>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
