import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedProd.css';

// Simple interceptor for debugging
axios.interceptors.request.use(request => {
  console.log(`Request: ${request.method} ${request.url}`);
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log(`Response: ${response.status} ${response.config.url}`);
  return response;
}, error => {
  console.error('Response Error:', error.message, error.config?.url);
  return Promise.reject(error);
});

const API_URL = 'http://localhost:5007/api/v1/products';
const CACHE_KEY = 'cached_products';

const FeaturedProd = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    loadProducts();

    const handleOnline = () => {
      console.log('Online');
      setIsOffline(false);
      loadProducts();
    };

    const handleOffline = () => {
      console.log('Offline');
      setIsOffline(true);
      loadFromCache();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Cancel any ongoing request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadProducts = async () => {
    console.log('Starting loadProducts');
    setIsLoading(true);
    setError('');

    if (!navigator.onLine) {
      console.log('Offline - loading from cache');
      loadFromCache();
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      console.log('Fetching from API:', API_URL);

      // Shorter timeout - 5 seconds instead of 10
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 5000);

      const res = await axios.get(API_URL, {
        signal: abortControllerRef.current.signal
      });

      clearTimeout(timeoutId);
      console.log('API response received');

      // Handle response data
      let productList = [];
      if (Array.isArray(res.data)) {
        productList = res.data;
      } else if (res.data && Array.isArray(res.data.products)) {
        productList = res.data.products;
      } else if (res.data) {
        // Try to find any array in the response
        const arrays = Object.values(res.data).filter(val => Array.isArray(val));
        productList = arrays.length > 0 ? arrays[0] : [];
      }

      console.log(`Found ${productList.length} products`);
      setProducts(productList);

      // Cache the products
      if (productList.length > 0) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(productList));
        } catch (e) {
          console.error('Failed to cache:', e);
        }
      }

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error loading products:', error.message);

      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        setError('Request took too long. Check your server connection.');
      } else if (error.message.includes('Network Error')) {
        setError('Network error. Server might be down.');
      } else {
        setError('Failed to load products.');
      }

      // Fall back to cache
      loadFromCache();
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const loadFromCache = () => {
    console.log('Loading from cache');
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log(`Loaded ${parsed.length} products from cache`);
        setProducts(parsed);
      } else {
        console.log('No cached products found');
        setProducts([]);
      }
    } catch (e) {
      console.error('Error loading cache:', e);
      setProducts([]);
    }
    setIsLoading(false);
  };

  const handleAddToCart = async (productId) => {
    if (!navigator.onLine) {
      alert('You are offline. Please connect to the internet to add items to cart.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5007/api/v1/cart/add',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        onCartUpdate?.(response.data.cart.totalItems);
        alert('Product added to cart');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async (productId) => {
    await handleAddToCart(productId);
    navigate('/Cartitem');
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Featured Products</h2>

      {isOffline && (
        <div className="alert alert-warning text-center mb-3">
          You are offline. Showing saved products.
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center mb-3">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={loadProducts}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={loadFromCache}
          >
            Use Cached Products
          </button>
        </div>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <div className="col-12 text-center my-5">
              <div className="alert alert-info">
                <h5>No products available</h5>
                <p className="mb-3">Check if the server is running on port 5007</p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={loadProducts}
                  >
                    Retry Loading
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      // Direct API test
                      fetch('http://localhost:5007/api/v1/products')
                        .then(r => {
                          console.log('Direct test status:', r.status);
                          return r.text();
                        })
                        .then(text => {
                          console.log('Direct test response (first 500 chars):', text.substring(0, 500));
                          if (text.includes('products')) {
                            alert('API returned data. Check console for details.');
                          }
                        })
                        .catch(e => {
                          console.error('Direct test error:', e);
                          alert('Cannot connect to server. Make sure backend is running.');
                        });
                    }}
                  >
                    Test Server Connection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="card shadow-sm h-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/200x200'}
                    className="card-img-top"
                    alt={product.productName}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="text-muted small mb-2">{product.category}</p>
                    <p className="fw-bold mb-3">₦{product.productPrice?.toLocaleString() || '0'}</p>
                    <div className="mt-auto">
                      <div className="d-grid gap-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleBuyNow(product._id)}
                          className="btn btn-primary btn-sm"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
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