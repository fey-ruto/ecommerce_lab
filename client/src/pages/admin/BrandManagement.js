import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ brand_name: '', cat_id: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brands:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingBrand) {
        await axios.put(`/api/brands/${editingBrand.brand_id}`, formData);
        setMessage('Brand updated successfully!');
      } else {
        await axios.post('/api/brands', formData);
        setMessage('Brand added successfully!');
      }
      
      setFormData({ brand_name: '', cat_id: '' });
      setEditingBrand(null);
      setShowForm(false);
      fetchBrands();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({ brand_name: brand.brand_name, cat_id: brand.cat_id });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    try {
      await axios.delete(`/api/brands/${id}`);
      setMessage('Brand deleted successfully!');
      fetchBrands();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setFormData({ brand_name: '', cat_id: '' });
    setEditingBrand(null);
    setShowForm(false);
    setMessage('');
  };

  // Group brands by category
  const brandsByCategory = brands.reduce((acc, brand) => {
    const catName = brand.categories ? brand.categories.cat_name : 'Uncategorized';
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(brand);
    return acc;
  }, {});

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
            <h2 className="card-title">Brand Management</h2>
            <button onClick={() => { setShowForm(true); setMessage(''); }} className="btn btn-primary">
              Add Brand
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '10px' }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.cat_id}
                  onChange={(e) => setFormData({ ...formData, cat_id: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.cat_id} value={cat.cat_id}>{cat.cat_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  Brand Name {editingBrand && `(ID: ${editingBrand.brand_id})`}
                </label>
                <input
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">
                  {editingBrand ? 'Update' : 'Add'} Brand
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: '2rem' }}>
            {Object.keys(brandsByCategory).map(catName => (
              <div key={catName} style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.5rem' }}>{catName}</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Brand Name</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brandsByCategory[catName].map(brand => (
                        <tr key={brand.brand_id}>
                          <td>{brand.brand_id}</td>
                          <td>{brand.brand_name}</td>
                          <td>{new Date(brand.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="actions">
                              <button onClick={() => handleEdit(brand)} className="btn btn-sm btn-secondary">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(brand.brand_id)} className="btn btn-sm btn-danger">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default BrandManagement;

