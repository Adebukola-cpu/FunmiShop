import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FeaturedProd.css";

const API_URL = "http://localhost:5007/api/v1/products";

const FeaturedProd = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);

      // IMPORTANT: products MUST be an array
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.post(
        "http://localhost:5007/api/v1/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onCartUpdate?.(res.data.cart.totalItems);
      alert("Added to cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      await handleAddToCart(productId);
      navigate("/Cartitem");
    } catch (error) {
      console.error("Buy Now failed", error);
    }
  };

  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Featured Products</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <p className="text-center">No products available</p>
          ) : (
            products.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <div className="card-body text-center">
                    <h6>{product.productName}</h6>
                    <p className="fw-bold">
                      ₦{product.productPrice?.toLocaleString()}
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product._id)}
                      className="btn btn-primary btn-sm w-100 mt-2"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedProd;

