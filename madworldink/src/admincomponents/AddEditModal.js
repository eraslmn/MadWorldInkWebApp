import React from "react";
import "../css/products.css";

const AddEditModal = ({ isOpen, product, onClose, onSubmit, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form id="addEditProductForm" onSubmit={onSubmit}>
          {/* Image Upload Field */}
          <div className="form-group">
            <label htmlFor="productImage">Upload Image:</label>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              name="image"
              onChange={onChange}
            />
          </div>

          {/* Image URL Field */}
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL:</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={product.imageUrl || ""}
              onChange={onChange}
            />
          </div>

          {/* Product Name Field */}
          <div className="form-group">
            <label htmlFor="productName">Product Name:</label>
            <input
              type="text"
              id="productName"
              name="name"
              value={product.name || ""}
              onChange={onChange}
              required
            />
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="productDescription">Description:</label>
            <textarea
              id="productDescription"
              name="description"
              value={product.description || ""}
              onChange={onChange}
              required
            />
          </div>

          {/* Details Field */}
          <div className="form-group">
            <label htmlFor="productDetails">Details:</label>
            <textarea
              id="productDetails"
              name="details"
              value={product.details || ""}
              onChange={onChange}
              required
            />
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label htmlFor="productPrice">Price:</label>
            <input
              type="number"
              id="productPrice"
              name="price"
              value={product.price || ""}
              onChange={onChange}
              required
            />
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="productCategory">Category:</label>
            <input
              type="text"
              id="productCategory"
              name="category"
              value={product.category || ""}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
