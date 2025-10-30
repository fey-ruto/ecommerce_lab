import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const SingleProduct = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadMessage('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('product_id', id);
      
      const response = await axios.post('/api/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadMessage('Image uploaded successfully!');
      // Refresh product to show new image
      fetchProduct();
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Product not found</h2>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/products" className="btn btn-secondary">← Back to Products</Link>
      </div>

      <div className="single-product">
        <div>
          {product.product_image ? (
            <img src={`/${product.product_image}`} alt={product.product_title} className="product-image-large" />
          ) : (
            <div className="product-image-large" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              No Image Available
            </div>
          )}
        </div>
        <div className="product-details">
          <h1>{product.product_title}</h1>
          <div className="product-price-large">${product.product_price}</div>
          
          <div className="product-meta">
            <p><strong>Category:</strong> {product.categories?.cat_name}</p>
            <p><strong>Brand:</strong> {product.brands?.brand_name}</p>
            {product.product_keyword && (
              <p><strong>Keywords:</strong> {product.product_keyword}</p>
            )}
          </div>

          {product.product_description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>Description</h3>
              <p className="product-description">{product.product_description}</p>
            </div>
          )}

          <div className="actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-large" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
              Add to Cart
            </button>
            
            {isAdmin && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {uploadMessage && (
                  <div className={`alert ${uploadMessage.includes('success') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
                    {uploadMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

