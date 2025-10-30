const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const supabase = require('../config/db');

const router = express.Router();

// Get all brands for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*, categories(cat_id, cat_name)')
      .eq('user_id', req.user.user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get brands by category
router.get('/category/:cat_id', authenticate, async (req, res) => {
  try {
    const { cat_id } = req.params;
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('cat_id', cat_id)
      .eq('user_id', req.user.user_id);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add brand (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { brand_name, cat_id } = req.body;
    
    if (!brand_name || !cat_id) {
      return res.status(400).json({ error: 'Brand name and category required' });
    }
    
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        brand_name,
        cat_id,
        user_id: req.user.user_id
      }])
      .select()
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Brand already exists in this category' });
      }
      throw error;
    }
    
    res.json({ message: 'Brand added successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update brand (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { brand_name } = req.body;
    
    if (!brand_name) {
      return res.status(400).json({ error: 'Brand name required' });
    }
    
    const { data, error } = await supabase
      .from('brands')
      .update({ brand_name })
      .eq('brand_id', id)
      .eq('user_id', req.user.user_id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    res.json({ message: 'Brand updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete brand (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('brand_id', id)
      .eq('user_id', req.user.user_id);
    
    if (error) throw error;
    
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

