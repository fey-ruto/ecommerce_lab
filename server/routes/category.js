const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const supabase = require('../config/db');

const router = express.Router();

// Get all categories for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', req.user.user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add category (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { cat_name } = req.body;
    
    if (!cat_name) {
      return res.status(400).json({ error: 'Category name required' });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        cat_name,
        user_id: req.user.user_id
      }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Category name already exists' });
      }
      throw error;
    }
    
    res.json({ message: 'Category added successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_name } = req.body;
    
    if (!cat_name) {
      return res.status(400).json({ error: 'Category name required' });
    }
    
    const { data, error } = await supabase
      .from('categories')
      .update({ cat_name })
      .eq('cat_id', id)
      .eq('user_id', req.user.user_id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('cat_id', id)
      .eq('user_id', req.user.user_id);
    
    if (error) throw error;
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

