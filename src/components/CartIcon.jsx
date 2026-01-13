import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CartIcon = () => {
    const [cartCount, setCartCount] = useState(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!token) {
                setCartCount(0);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5007/api/v1/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.status && response.data.cart) {
                    setCartCount(response.data.cart.totalItems || 0);
                }
            } catch (error) {
                console.error('Error fetching cart count:', error);
                setCartCount(0);
            }
        };

        fetchCartCount();
        // Refresh cart count every 10 seconds
        const interval = setInterval(fetchCartCount, 10000);
        return () => clearInterval(interval);
    }, [token]);

    return (
        <Link
            to="/CartItem"
            className="position-relative text-decoration-none me-3"
            style={{ color: '#212529' }}   // dark icon on white navbar
            aria-label="Cart"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5z" />
                <path d="M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>

            {cartCount > 0 && (
                <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.65rem', padding: '0.25rem 0.45rem' }}
                >
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            )}
        </Link>

        
        // <Link to="/CartItem" className="position-relative text-decoration-none text-white me-3">
        //     <i className="bi bi-cart fs-5"></i>
        //     {cartCount > 0 && (
        //         <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        //             style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem' }}>
        //             {cartCount > 99 ? '99+' : cartCount}
        //         </span>
        //     )}
        // </Link>
    );
};

export default CartIcon;