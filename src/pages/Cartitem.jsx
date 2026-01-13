import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './CartPage.css'; // Optional CSS file

const Cartitem = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5007/api/v1/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        setCart(response.data.cart || {
          items: [],
          totalPrice: 0,
          totalItems: 0
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (!token) {
      alert('Please login to update cart');
      navigate('/login');
      return;
    }

    try {
      setUpdating(productId);
      await axios.put(
        `http://localhost:5007/api/v1/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!token) {
      alert('Please login to remove items');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to remove this item from cart?')) return;

    try {
      await axios.delete(
        `http://localhost:5007/api/v1/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error removing item:', error);
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!token) {
      alert('Please login to clear cart');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      await axios.delete(
        'http://localhost:5007/api/v1/cart/clear',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert(error.response?.data?.message || 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!token) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    alert('Proceeding to checkout...');
    // navigate('/checkout'); // You can add checkout page later
  };

  const incrementQuantity = (productId, currentQuantity) => {
    handleQuantityChange(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityChange(productId, currentQuantity - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading cart...</span>
        </div>
        <p className="mt-3">Loading your cart...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card shadow">
              <div className="card-body py-5">
                <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                <h3>Please Login</h3>
                <p className="text-muted mb-4">You need to login to view your cart</p>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Shopping Cart</h2>
                {cart.items.length > 0 && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearCart}
                    disabled={loading}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear Cart
                  </button>
                )}
              </div>
              <p className="text-muted mb-0">
                {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            <div className="card-body">
              {cart.items.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x display-1 text-muted"></i>
                  <h4 className="mt-4">Your cart is empty</h4>
                  <p className="text-muted mb-4">Add some products to get started!</p>
                  <Link to="/" className="btn btn-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="cart-item border-bottom pb-4 mb-4">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{
                              maxHeight: '100px',
                              width: '100px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        <div className="col-md-5">
                          <h5 className="mb-1">{item.name}</h5>
                          <p className="text-muted mb-2 small">
                            Price: {formatPrice(item.price)}
                          </p>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={updating === item.productId}
                          >
                            <i className="bi bi-trash me-1"></i> Remove
                          </button>
                        </div>
                        <div className="col-md-3">
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => decrementQuantity(item.productId, item.quantity)}
                              disabled={updating === item.productId || item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input
                              type="number"
                              className="form-control form-control-sm mx-2 text-center"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                              min="1"
                              style={{ width: '60px' }}
                              disabled={updating === item.productId}
                            />
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => incrementQuantity(item.productId, item.quantity)}
                              disabled={updating === item.productId}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          {updating === item.productId && (
                            <div className="spinner-border spinner-border-sm text-primary mt-2" role="status">
                              <span className="visually-hidden">Updating...</span>
                            </div>
                          )}
                        </div>
                        <div className="col-md-2 text-end">
                          <h5 className="mb-0">{formatPrice(item.price * item.quantity)}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">Order Summary</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cart.totalItems} items)</span>
                <span>{formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>{formatPrice(0)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h5>Total</h5>
                <h5>{formatPrice(cart.totalPrice)}</h5>
              </div>

              {cart.items.length > 0 ? (
                <>
                  <button
                    className="btn btn-primary w-100 py-2 mb-3"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    <i className="bi bi-lock-fill me-2"></i>
                    Proceed to Checkout
                  </button>
                  <Link to="/" className="btn btn-outline-primary w-100 py-2">
                    Continue Shopping
                  </Link>
                </>
              ) : (
                <Link to="/" className="btn btn-primary w-100 py-2">
                  Start Shopping
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cartitem;