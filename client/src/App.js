import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryManagement from './pages/admin/CategoryManagement';
import BrandManagement from './pages/admin/BrandManagement';
import ProductManagement from './pages/admin/ProductManagement';
import AllProducts from './pages/AllProducts';
import SingleProduct from './pages/SingleProduct';
import SearchResults from './pages/SearchResults';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/search" element={<SearchResults />} />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CategoryManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/brands" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <BrandManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductManagement />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

