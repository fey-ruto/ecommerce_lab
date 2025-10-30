import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedBrand || searchQuery) {
      fetchFilteredProducts();
    } else {
      fetchProducts();
    }
  }, [selectedCategory, selectedBrand]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchFilteredProducts = async () => {
    try {
      let url = '/api/products';
      if (selectedCategory) {
        url = `/api/products/filter/category/${selectedCategory}`;
      } else if (selectedBrand) {
        url = `/api/products/filter/brand/${selectedBrand}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      const response = await axios.get(`/api/products/search/${encodeURIComponent(searchQuery)}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>All Products</h1>

      <div className="search-filter-container">
        <div className="search-filter-row">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
        <div className="search-filter-row" style={{ marginTop: '1rem' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-group select"
            style={{ width: 'auto', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
            ))}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="form-group select"
            style={{ width: 'auto', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
            ))}
          </select>
          {(selectedCategory || selectedBrand) && (
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
              {products.map(product => (
                <div key={product.product_id} className="product-card">
                  {product.product_image && (
                    <img src={`/${product.product_image}`} alt={product.product_title} className="product-image" />
                  )}
                  <div className="product-info">
                <h3 className="product-title">{product.product_title}</h3>
                <div className="product-price">${product.product_price}</div>
                <div className="product-category">Category: {product.categories?.cat_name}</div>
                <div className="product-brand">Brand: {product.brands?.brand_name}</div>
                <Link to={`/products/${product.product_id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;

