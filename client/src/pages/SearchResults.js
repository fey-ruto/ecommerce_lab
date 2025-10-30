import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async () => {
    try {
      const response = await axios.get(`/api/products/search/${encodeURIComponent(query)}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching products:', error);
      setLoading(false);
    }
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
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>
        Search Results for "{query}"
      </h1>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>No products found for "{query}"</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View All Products
          </Link>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.product_id} className="product-card">
                {product.product_image && (
                  <img src={product.product_image} alt={product.product_title} className="product-image" />
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
        </>
      )}
    </div>
  );
};

export default SearchResults;

