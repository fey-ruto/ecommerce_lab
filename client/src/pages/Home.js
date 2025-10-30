import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to Our E-Commerce Store</h1>
        {!isAuthenticated ? (
          <>
            <p>Please login or register to start shopping</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Register
              </Link>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
          </>
        ) : isAdmin ? (
          <>
            <p>Welcome back, {user?.email}! Manage your store.</p>
            <div className="admin-actions">
              <Link to="/admin/categories" className="btn btn-primary">Manage Categories</Link>
              <Link to="/admin/brands" className="btn btn-primary">Manage Brands</Link>
              <Link to="/admin/products" className="btn btn-primary">Add Products</Link>
              <Link to="/products" className="btn btn-secondary">View Products</Link>
            </div>
          </>
        ) : (
          <>
            <p>Welcome back, {user?.email}! Browse our products.</p>
            <div className="user-actions">
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
            </div>
          </>
        )}
      </div>

      {isAuthenticated && (
        <div className="featured-section">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Quick Links</h2>
          <div className="quick-links">
            <div className="quick-link-card">
              <h3>Products</h3>
              <p>View all available products</p>
              <Link to="/products" className="btn btn-outline">View All</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

