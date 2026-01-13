
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Sec from "./components/Sec"
import FeaturedProd from './components/FeaturedProd'
import Testimo from './components/Testimo'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Addproduct from './pages/Addproduct'
import Cartitem from './pages/Cartitem'
import Logout from './pages/Logout'
import CartIcon from './components/CartIcon'
import Dashboard from './pages/Dashboard'
import Wishlist from './pages/Wishlist'
import Shop from './pages/Shop'
import Deals from './pages/Deals'
import Searchpage from './pages/Searchpage'


const App = () => {
  return (
    <>
    <Navbar/>

    <Routes>
        <Route path="" element={<Navigate to="/Home" replace />} />

        <Route path="/Home" element={<>
          <CartIcon />
          <Sec />
          <FeaturedProd />
          <Testimo />
          <Footer />
        </>} />

        <Route path="/Signup" element={<Signup/>} />

        <Route path="/Login" element={<Login/>} />

        <Route path="/Contact" element={<Contact/>} />

        <Route path="/Addproduct" element={<Addproduct />} />

        <Route path="/Cartitem" element={<Cartitem />} />

        <Route path="/Logout" element={<Logout />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<Shop />} />

        <Route path="/deals" element={<Deals />} />

        <Route path="/Search" element={<Searchpage />} />
        
        <Route path="*" element={<NotFound/>} />


    </Routes>
    </>
  )
}

export default App
