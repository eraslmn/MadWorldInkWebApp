import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext to access the authToken
import '../css/products.css'; // Adjust the path as needed

const ProductList = ({ onEdit, onDelete }) => {
    const [products, setProducts] = useState([]);
    const { authToken } = useAuth(); // Get the authToken from the context

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://localhost:7213/api/Product', {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Use the token in your request headers
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="product-list">
            {products.length === 0 ? (
                <div className="no-products">Hey, you haven't added any products yet. Click the '+' button to add a product.</div>
            ) : (
                products.map((product, index) => (
                    <div key={index} className="product-card">
                        <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-details">{product.details}</div>
                        <div className="product-price">${product.price}</div>
                        <div className="product-actions">
                            <button className="edit-button" onClick={() => onEdit(product)}>Edit</button>
                            <button className="delete-button" onClick={() => onDelete(product.id)}>Delete</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;
