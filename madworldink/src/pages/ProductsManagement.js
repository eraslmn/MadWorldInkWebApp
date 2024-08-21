import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../admincomponents/AdminHeader";
import ProductList from "../admincomponents/ProductList";
import AddEditModal from "../admincomponents/AddEditModal";
import DeleteConfirmModal from "../admincomponents/DeleteConfirmModal";
import AdminFooter from "../admincomponents/AdminFooter";
import "../css/products.css";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);

  const { authToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [authToken, navigate]);

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

        // Sort products by id in ascending order
        const sortedData = data.sort((a, b) => a.id - b.id);
        setProducts(sortedData);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openAddEditModal = (product = null) => {
    setSelectedProduct(
        product || {
          id: undefined, // Ensure ID is undefined for new products
            name: "",
            description: "",
            price: "",
            image: "",
            details: "",
            category: "",
            imageUrl: "",
        }
    );
    setIsAddEditModalOpen(true);
};

  const closeAddEditModal = () => setIsAddEditModalOpen(false);

  const handleAddEditProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Conditionally add the Id only if it exists
    if (selectedProduct.id) {
        formData.append("Id", selectedProduct.id); // Only for updates
    }

    formData.append("Name", selectedProduct.name);
    formData.append("Description", selectedProduct.description);
    formData.append("Price", parseFloat(selectedProduct.price));
    formData.append("Category", selectedProduct.category);
    formData.append("Details", selectedProduct.details || "");

    if (selectedProduct.image) {
        formData.append("Image", selectedProduct.image); // Append image if it exists
    }

    formData.append("ImageUrl", selectedProduct.imageUrl || ""); // Append ImageUrl

    try {
        let response;
        if (selectedProduct.id) {
            // Update existing product (PUT)
            response = await fetch(`https://localhost:7213/api/Product/${selectedProduct.id}`, {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        } else {
            // Create new product (POST)
            response = await fetch("https://localhost:7213/api/Product", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error:", errorText);
            alert(`Error: ${errorText}`);
            throw new Error("Failed to save product");
        }

        const savedProduct = await response.json();
        if (selectedProduct.id) {
            // Update the existing product in the state and sort by id
            setProducts(products.map(product => product.id === selectedProduct.id ? savedProduct : product).sort((a, b) => a.id - b.id));
        } else {
            // Add the new product and sort by id
            setProducts([...products, savedProduct].sort((a, b) => a.id - b.id));
        }

        closeAddEditModal();
    } catch (error) {
        console.error("Error saving product:", error);
    }
};


  const handleCreateProduct = async (newProduct) => {
    const formData = new FormData();
    formData.append("Name", newProduct.name);
    formData.append("Description", newProduct.description);
    formData.append("Price", parseFloat(newProduct.price));
    formData.append("Category", newProduct.category || "Default Category");
    formData.append("Details", newProduct.details || "");

    // Handling image if provided
    if (newProduct.image) {
      formData.append("Image", newProduct.image); // Only append if image is selected
    }

    // Log FormData for debugging
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch("https://localhost:7213/api/Product", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error(
          "Server responded with validation errors:",
          errorDetails.errors
        );
        alert(
          `Error: ${errorDetails.title}. Please check the fields and try again.`
        );
        throw new Error("Failed to create product");
      }

      const createdProduct = await response.json();
      console.log("Product created successfully:", createdProduct);
      setProducts([...products, createdProduct]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    const formData = new FormData();

    formData.append("Id", updatedProduct.id);
    formData.append("Name", updatedProduct.name);
    formData.append("Description", updatedProduct.description);
    formData.append("Price", parseFloat(updatedProduct.price));
    formData.append("Category", updatedProduct.category);
    formData.append("Details", updatedProduct.details || "");

    // Append the Image only if a new one is selected
    if (updatedProduct.image) {
        formData.append("Image", updatedProduct.image); 
    }

    // Append the ImageUrl (either the existing one or the newly uploaded one)
    formData.append("ImageUrl", updatedProduct.imageUrl || "");

    try {
        const response = await fetch(
            `https://localhost:7213/api/Product/${updatedProduct.id}`,
            {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("Server responded with validation errors:", errorDetails.errors);
            alert(`Error: ${errorDetails.title}. Please check the fields and try again.`);
            throw new Error("Failed to update product");
        }

        const updatedProductData = await response.json();
        setProducts(
            products.map((product) =>
                product.id === updatedProduct.id ? updatedProductData : product
            )
        );
    } catch (error) {
        console.error("Error updating product:", error);
    }
};


  const openDeleteConfirmModal = (productId) => {
    setSelectedProduct(products.find((product) => product.id === productId));
    setIsDeleteConfirmModalOpen(true);
  };

  const closeDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(false);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(
        `https://localhost:7213/api/Product/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(
        products.filter((product) => product.id !== selectedProduct.id)
      );
      closeDeleteConfirmModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setSelectedProduct({
        ...selectedProduct,
        image: files[0], // Set the selected image
      });
    } else {
      setSelectedProduct({ ...selectedProduct, [name]: value });
    }
  };

  return (
    <div>
      <AdminHeader onLogout={handleLogout} />
      <div className="products-container">
        <div className="products-header">
          <h3 className="products-heading">Product List</h3>
          <div className="products-search-bar">
            <input type="text" id="searchInput" placeholder="Search..." />
            <button>
              <i className="bx bx-search"></i>
            </button>
          </div>
        </div>
        <ProductList
          products={products}
          onEdit={openAddEditModal}
          onDelete={openDeleteConfirmModal}
        />
        <button
          type="button"
          className="add-product-button"
          onClick={() => openAddEditModal()}
        >
          +
        </button>
      </div>
      <AddEditModal
        isOpen={isAddEditModalOpen}
        product={selectedProduct}
        onClose={closeAddEditModal}
        onSubmit={handleAddEditProduct}
        onChange={handleInputChange}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={handleDeleteProduct}
      />
      <AdminFooter />
    </div>
  );
};

export default ProductsManagement;
