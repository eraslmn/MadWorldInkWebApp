import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../homecomponents/CartContext";
import "../css/styles.css";

const Latest = () => {
  const [products, setProducts] = useState([]);
  const { authToken, user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://localhost:7213/api/Product", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      const printProducts = data.filter(product => product.category === 'Print');
      setProducts(printProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = (product) => {
    if (!user || !user.id) {
      console.error("User ID is missing or user object is undefined");
      return;
    }

    if (!product || !product.id) {  // Use `product.id` instead of `product.productId`
      console.error("Product is missing or invalid", product);
      return;
    }

    addToCart({ ...product, productId: product.id }, authToken, user.id); // Map `id` to `productId`
  };

  return (
    <div className="latest" id="latest" style={{ position: "relative" }}>
      <h2 className="section__title" style={{ color: "whitesmoke" }}>
        <span className="bold">MADWORLDINK</span>
        <br />
        <span className="light">AVAILABLE PRINTS</span>
      </h2>

      <div className="latest__container" id="latest__swiper">
        {products.length === 0 ? (
          <div className="no-products">No products available</div>
        ) : (
          products.map((product, index) => (
            <div key={index} className="latest__content">
              <div
                className="latest__wallpaper"
                style={{
                  backgroundImage: `url(${product.imageUrl || "https://via.placeholder.com/150"})`,
                }}
              ></div>
              <div className="latest__desc">
                <span className="latest__h">{product.name}</span>
                <span className="latest__p">{product.description}</span>
                <span className="latest__p">${product.price}</span>
              </div>
              <button className="button latest__button" onClick={() => handleAddToCart(product)}>
                <i className="bx bx-plus latest__icon"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Latest;

