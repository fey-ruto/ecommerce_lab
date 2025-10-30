import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_title: '',
    product_price: '',
    product_description: '',
    product_keyword: '',
    cat_id: '',
    brand_id: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (formData.cat_id) {
      const brandsForCategory = brands.filter(b => b.cat_id === parseInt(formData.cat_id));
      setFilteredBrands(brandsForCategory);
    } else {
      setFilteredBrands([]);
    }
  }, [formData.cat_id, brands]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/my-products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let productId;
      
      if (editingProduct) {
        const response = await axios.put(`/api/products/${editingProduct.product_id}`, formData);
        productId = editingProduct.product_id;
        setMessage('Product updated successfully!');
      } else {
        const response = await axios.post('/api/products', formData);
        productId = response.data.data.product_id;
        setMessage('Product added successfully!');
      }
      
      // Upload image if provided
      if (imageFile && productId) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        formDataUpload.append('product_id', productId);
        
        await axios.post('/api/upload/product', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setMessage('Product and image uploaded successfully!');
      }
      
      setFormData({
        product_title: '',
        product_price: '',
        product_description: '',
        product_keyword: '',
        cat_id: '',
        brand_id: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_title: product.product_title,
      product_price: product.product_price,
      product_description: product.product_description || '',
      product_keyword: product.product_keyword || '',
      cat_id: product.cat_id,
      brand_id: product.brand_id
    });
    // Show existing image if available
    if (product.product_image) {
      setImagePreview(`/${product.product_image}`);
    } else {
      setImagePreview(null);
    }
    setImageFile(null); // Clear file input for new uploads
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      product_title: '',
      product_price: '',
      product_description: '',
      product_keyword: '',
      cat_id: '',
      brand_id: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
    setMessage('');
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
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Product Management</h2>
            <button onClick={() => { setShowForm(true); setMessage(''); }} className="btn btn-primary">
              Add Product
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '10px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.cat_id}
                    onChange={(e) => setFormData({ ...formData, cat_id: e.target.value, brand_id: '' })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    required
                    disabled={!formData.cat_id}
                  >
                    <option value="">Select Brand</option>
                    {filteredBrands.map(brand => (
                      <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  value={formData.product_title}
                  onChange={(e) => setFormData({ ...formData, product_title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Product Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.product_price}
                  onChange={(e) => setFormData({ ...formData, product_price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Product Description</label>
                <textarea
                  value={formData.product_description}
                  onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Product Keyword</label>
                <input
                  type="text"
                  value={formData.product_keyword}
                  onChange={(e) => setFormData({ ...formData, product_keyword: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                {imagePreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </div>
                )}
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="products-grid" style={{ marginTop: '2rem' }}>
            {products.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No products yet</p>
            ) : (
              products.map(product => (
                <div key={product.product_id} className="product-card">
                  {product.product_image && (
                    <img src={product.product_image} alt={product.product_title} className="product-image" />
                  )}
                  <div className="product-info">
                    <h3 className="product-title">{product.product_title}</h3>
                    <div className="product-price">${product.product_price}</div>
                    <div className="product-category">Category: {product.categories?.cat_name}</div>
                    <div className="product-brand">Brand: {product.brands?.brand_name}</div>
                    <div className="actions" style={{ marginTop: '1rem' }}>
                      <button onClick={() => handleEdit(product)} className="btn btn-sm btn-secondary">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
};

export default ProductManagement;

