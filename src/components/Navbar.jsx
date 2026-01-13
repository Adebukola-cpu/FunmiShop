import React from 'react';

import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser.isAdmin || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 sticky-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/images/log2.png"
            alt="ShopHub Logo"
            className="me-2"
            style={{
              width: '150px',
              height: 'auto',
              transition: 'all 0.3s ease',
              transform: scrolled ? 'scale(0.9)' : 'scale(1)'
            }}
          />
          <span className="fw-bold text-primary d-none d-md-block" style={{ fontSize: '1.25rem' }}>
            ShopHub
          </span>
        </Link>

        {/* Search Bar for Desktop */}
        <div className="d-none d-lg-flex mx-4" style={{ flex: 1, maxWidth: '500px' }}>
          <form onSubmit={handleSearch} className="w-100">
            <div className="input-group">
              <input
                type="text"
                className="form-control border-end-0"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
              />
              <button
                type="submit"
                className="btn btn-primary border-start-0"
                style={{ borderRadius: '0 0.5rem 0.5rem 0' }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar for Mobile */}
          <div className="d-lg-none mb-3">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link px-3 fw-medium">
                <i className="bi bi-house-door me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link px-3 fw-medium">
                <i className="bi bi-shop me-1"></i>
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/deals" className="nav-link px-3 fw-medium">
                <i className="bi bi-lightning-charge me-1"></i>
                Deals
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link to="/Addproduct" className="nav-link px-3 fw-medium text-success">
                  <i className="bi bi-plus-circle me-1"></i>
                  Add Product
                </Link>
              </li>
            )}
          </ul>

          {/* Right Side Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <CartIcon />

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="text-dark position-relative" title="Wishlist">
              <i className="bi bi-heart fs-5"></i>
            </Link>

            {/* User Area */}
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-link p-0 border-0 dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="rounded-circle border border-primary"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                  <li className="dropdown-header text-center fw-bold mb-2">
                    Hi, {user?.fullName?.split(' ')[0] || 'User'}!
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/Signup" className="dropdown-item">
                      <i className="bi bi-person me-2"></i>Signup
                    </Link>
                  </li>
                  <li>
                    <Link to="/Login" className="dropdown-item">
                      <i className="bi bi-receipt me-2"></i>Login
                    </Link>
                  </li>
                  {isAdmin && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link to="/dashboard" className="dropdown-item text-success">
                          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary px-3">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary px-3">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




// import React from 'react'
// import { Link } from 'react-router-dom'
// const Navbar = () => {
//   return (
//     <div>

//     <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
//   <div className="container">
//     <a className="navbar-brand fw-bold" href="#"><img src="/images/log2.png" alt="" width={150} height={100} /></a>
//     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//       <span className="navbar-toggler-icon"></span>
//     </button>
//     <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
//       <ul className="navbar-nav">
//          <li className="nav-item"><Link to={'/Home'} className="btn btn-info">Home</Link></li> 
//         <li className="nav-item"><Link to={'/Login'} className="btn btn-primary">Login</Link></li>
//         <li className="nav-item"><Link to={'/Contact'} className="btn btn-secondary">Contact</Link></li>
//         <li className="nav-item"><Link to={'/Signup'} className="btn btn-warning">Signup</Link></li>
//         <li className="nav-item"><Link to={'/Logout'} className="btn btn-danger">Logout</Link></li>
//         {/* <li className="nav-item"><Link to={'/AddProduct'} className="btn btn-success">Add Product</Link></li> */}

//       </ul>
//     </div>
//   </div>
// </nav>

//     </div>
//   )
// }

// export default Navbar