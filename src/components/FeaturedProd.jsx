import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedProd.css';

// Add axios interceptors for debugging
axios.interceptors.request.use(
  request => {
    console.log('Starting Request:', {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });
    return request;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log('Response Success:', {
      status: response.status,
      url: response.config.url,
      dataStructure: response.data ? {
        isArray: Array.isArray(response.data),
        hasProducts: !!(response.data && response.data.products),
        keys: Object.keys(response.data)
      } : 'no data'
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    if (!error.response) {
      console.error('No response received - Possible network/server issue');
    }

    return Promise.reject(error);
  }
);

const API_URL = 'http://localhost:5007/api/v1/products';
const CACHE_KEY = 'cached_products';

const FeaturedProd = ({ onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    console.log('FeaturedProd useEffect running');

    if (hasLoadedRef.current) {
      console.log('Already loaded, skipping...');
      return;
    }

    loadProducts();
    hasLoadedRef.current = true;

    const handleOnline = () => {
      console.log('Online event fired');
      setIsOffline(false);
      loadProducts();
    };

    const handleOffline = () => {
      console.log('Offline event fired');
      setIsOffline(true);
      loadFromCache();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadProducts = async () => {
    console.log('loadProducts function called');
    console.log('Current online status:', navigator.onLine);

    setIsLoading(true);
    setApiError('');

    if (!navigator.onLine) {
      console.log('Device is offline, loading from cache');
      loadFromCache();
      setIsLoading(false);
      return;
    }

    try {
      console.log('Making API call to:', API_URL);
      console.log('Time before fetch:', new Date().toISOString());

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await axios.get(API_URL, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Time after fetch:', new Date().toISOString());
      console.log('Full response:', res);

      let productList = [];
      if (Array.isArray(res.data)) {
        productList = res.data;
        console.log('Direct array received with', productList.length, 'products');
      } else if (res.data && Array.isArray(res.data.products)) {
        productList = res.data.products;
        console.log('Products array in response.data.products with', productList.length, 'products');
      } else if (res.data) {
        console.warn('Unexpected response structure:', res.data);
        productList = Object.values(res.data).find(val => Array.isArray(val)) || [];
      }

      console.log('Final product list:', productList.length, 'items');

      if (productList.length > 0) {
        console.log('Sample product:', productList[0]);
      }

      setProducts(productList);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(productList));
        console.log('Products cached successfully');
      } catch (e) {
        console.error('Failed to cache products:', e);
      }

    } catch (error) {
      console.error('API Error caught:', error);

      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        setApiError('Request timed out. Server might be slow or unresponsive.');
        console.error('Request timeout - server took too long to respond');
      } else if (!error.response) {
        setApiError('Network error. Please check your connection and server.');
        console.error('Network error - No response from server');
      } else {
        setApiError(`Server error: ${error.response?.status || 'Unknown'}`);
      }

      loadFromCache();
    } finally {
      setIsLoading(false);
      console.log('loadProducts function completed');
    }
  };

  const loadFromCache = () => {
    console.log('Loading from localStorage cache...');
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('Loaded', parsed.length, 'products from cache');
        if (parsed.length > 0) {
          console.log('Sample cached product:', parsed[0]);
        }
        setProducts(parsed);
      } else {
        console.warn('No cached products found in localStorage');
        setProducts([]);
      }
    } catch (e) {
      console.error('Error loading from cache:', e);
      setProducts([]);
    }
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

      <div className="alert alert-info mb-3">
        <div className="row">
          <div className="col">
            <strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}
          </div>
          <div className="col">
            <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
          </div>
          <div className="col">
            <strong>Products Found:</strong> {products.length}
          </div>
        </div>
        {apiError && (
          <div className="mt-2 text-danger">
            <strong>Error:</strong> {apiError}
          </div>
        )}
      </div>

      {isOffline && (
        <div className="alert alert-warning text-center">
          You are offline. Showing saved products.
        </div>
      )}

      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
          <p className="mt-2">Loading products from server...</p>
          <button
            className="btn btn-outline-secondary btn-sm mt-2"
            onClick={() => {
              console.log('Manual reload triggered');
              loadFromCache();
              setIsLoading(false);
            }}
          >
            Use Cached Products
          </button>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center my-5">
              <div className="alert alert-warning">
                <h5>No products available</h5>
                <p>Try these troubleshooting steps:</p>
                <ol className="text-start">
                  <li>Check if backend server is running</li>
                  <li>Verify API endpoint: {API_URL}</li>
                  <li>Check browser console for errors</li>
                </ol>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    console.log('Retrying load...');
                    loadProducts();
                  }}
                >
                  Retry Loading
                </button>
                <button
                  className="btn btn-outline-primary ms-2 mt-2"
                  onClick={() => {
                    console.log('Testing API endpoint...');
                    fetch(API_URL)
                      .then(r => {
                        console.log('Direct fetch status:', r.status);
                        return r.text();
                      })
                      .then(text => {
                        console.log('Direct fetch response:', text.substring(0, 200));
                      })
                      .catch(e => console.error('Direct fetch error:', e));
                  }}
                >
                  Test API
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div className="col-md-3 mb-4" key={product._id || product.id}>
                  <div className="card shadow-sm h-100 product-card">
                    <img
                      src={product.image || 'https://via.placeholder.com/200'}
                      className="card-img-top"
                      alt={product.productName || 'Product'}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        console.log('Image failed to load for:', product.productName);
                        e.target.src = 'https://via.placeholder.com/200';
                      }}
                    />
                    <div className="card-body text-center d-flex flex-column">
                      <h5 className="card-title">{product.productName || 'Unnamed Product'}</h5>
                      <p className="text-muted small mb-2">{product.category || 'Uncategorized'}</p>
                      <p className="fw-bold">₦{product.productPrice?.toLocaleString() || '0'}</p>
                      <div className="mt-auto">
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => handleAddToCart(product._id || product.id)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleBuyNow(product._id || product.id)}
                            className="btn btn-primary btn-sm"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedProd;