import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../homecomponents/CartContext";
import "../css/styles.css";

const HomeDecor = () => {
  const [products, setProducts] = useState([]);
  const { authToken, user } = useAuth();  // Ensure user is extracted from useAuth
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
      const homeDecorProducts = data.filter(product => product.category === 'Home Decor');
      setProducts(homeDecorProducts);
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

  useEffect(() => {
    const homeDecorSwiper = document.getElementById("homedecor__swiper");
    const homeDecorContent = document.querySelectorAll(".latest__content");

    const homeDecorPrevBtn = document.getElementById("homedecorPrevBtn");
    const homeDecorNextBtn = document.getElementById("homedecorNextBtn");

    let counterHomeDecor = 0;
    const sizeHomeDecor = homeDecorContent.length > 0 ? homeDecorContent[0].clientWidth + 16 * 2 : 0;
    if (sizeHomeDecor > 0) {
      homeDecorSwiper.style.transform = `translateX(${
        -sizeHomeDecor * counterHomeDecor
      }px)`;
    }

    const handleNext = () => {
      if (counterHomeDecor >= homeDecorContent.length - 4) return;
      counterHomeDecor++;
      homeDecorSwiper.style.transition = "transform 0.5s ease-in-out";
      homeDecorSwiper.style.transform = `translateX(${
        -sizeHomeDecor * counterHomeDecor
      }px)`;
    };

    const handlePrev = () => {
      if (counterHomeDecor <= 0) return;
      counterHomeDecor--;
      homeDecorSwiper.style.transition = "transform 0.5s ease-in-out";
      homeDecorSwiper.style.transform = `translateX(${
        -sizeHomeDecor * counterHomeDecor
      }px)`;
    };

    homeDecorNextBtn?.addEventListener("click", handleNext);
    homeDecorPrevBtn?.addEventListener("click", handlePrev);

    return () => {
      homeDecorNextBtn?.removeEventListener("click", handleNext);
      homeDecorPrevBtn?.removeEventListener("click", handlePrev);
    };
  }, [products]);

  return (
    <div className="latest" id="homedecor" style={{ position: "relative" }}>
      <h2 className="section__title" style={{ color: "whitesmoke" }}>
        <span className="bold">MADWORLDINK</span>
        <br />
        <span className="light">HOME DECOR</span>
      </h2>

      <i className="bx bx-chevron-left hd-prev-button" id="homedecorPrevBtn"></i>
      <i className="bx bx-chevron-right hd-next-button" id="homedecorNextBtn"></i>

      <div className="latest__container" id="homedecor__swiper">
        {products.length === 0 ? (
          <div className="no-products">No products available</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="latest__content">
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

export default HomeDecor;
