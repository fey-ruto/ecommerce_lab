import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>
            <Link to="/">E-Commerce Store</Link>
          </h1>
        </div>
        <ul className="nav-menu">
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/register" className="nav-link">Register</Link>
              </li>
              <li>
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            </>
          ) : isAdmin ? (
            <>
              <li>
                <Link to="/admin/categories" className="nav-link">Categories</Link>
              </li>
              <li>
                <Link to="/admin/brands" className="nav-link">Brands</Link>
              </li>
              <li>
                <Link to="/admin/products" className="nav-link">Add Product</Link>
              </li>
              <li>
                <Link to="/products" className="nav-link">All Products</Link>
              </li>
              <li>
                <button onClick={logout} className="nav-link btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/products" className="nav-link">All Products</Link>
              </li>
              <li>
                <button onClick={logout} className="nav-link btn-logout">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

