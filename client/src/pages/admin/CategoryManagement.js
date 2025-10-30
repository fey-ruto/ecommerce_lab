import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ cat_name: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.cat_id}`, formData);
        setMessage('Category updated successfully!');
      } else {
        await axios.post('/api/categories', formData);
        setMessage('Category added successfully!');
      }
      
      setFormData({ cat_name: '' });
      setEditingCategory(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ cat_name: category.cat_name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`/api/categories/${id}`);
      setMessage('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleCancel = () => {
    setFormData({ cat_name: '' });
    setEditingCategory(null);
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
            <h2 className="card-title">Category Management</h2>
            <button onClick={() => { setShowForm(true); setMessage(''); }} className="btn btn-primary">
              Add Category
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
                <label>
                  Category Name {editingCategory && `(ID: ${editingCategory.cat_id})`}
                </label>
                <input
                  type="text"
                  value={formData.cat_name}
                  onChange={(e) => setFormData({ cat_name: e.target.value })}
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Add'} Category
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="table-container" style={{ marginTop: '2rem' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No categories yet</td>
                  </tr>
                ) : (
                  categories.map(cat => (
                    <tr key={cat.cat_id}>
                      <td>{cat.cat_id}</td>
                      <td>{cat.cat_name}</td>
                      <td>{new Date(cat.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="actions">
                          <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-secondary">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(cat.cat_id)} className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default CategoryManagement;

