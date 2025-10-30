const express = require('express');
const { authenticate, isAdmin } = require('../middleware/auth');
const supabase = require('../config/db');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's products
router.get('/my-products', authenticate, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .eq('user_id', req.user.user_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .eq('product_id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .or(`product_title.ilike.%${query}%, product_description.ilike.%${query}%, product_keyword.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter products by category
router.get('/filter/category/:cat_id', async (req, res) => {
  try {
    const { cat_id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .eq('cat_id', cat_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter products by brand
router.get('/filter/brand/:brand_id', async (req, res) => {
  try {
    const { brand_id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(cat_name), brands(brand_name)')
      .eq('brand_id', brand_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { product_title, product_price, product_description, product_image, product_keyword, cat_id, brand_id } = req.body;
    
    if (!product_title || !product_price || !cat_id || !brand_id) {
      return res.status(400).json({ error: 'Product title, price, category, and brand required' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        product_title,
        product_price,
        product_description: product_description || '',
        product_image: product_image || '',
        product_keyword: product_keyword || '',
        cat_id,
        brand_id,
        user_id: req.user.user_id
      }])
      .select('*, categories(cat_name), brands(brand_name)')
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Product added successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { product_title, product_price, product_description, product_image, product_keyword, cat_id, brand_id } = req.body;
    
    const updateData = {};
    if (product_title) updateData.product_title = product_title;
    if (product_price) updateData.product_price = product_price;
    if (product_description !== undefined) updateData.product_description = product_description;
    if (product_image !== undefined) updateData.product_image = product_image;
    if (product_keyword !== undefined) updateData.product_keyword = product_keyword;
    if (cat_id) updateData.cat_id = cat_id;
    if (brand_id) updateData.brand_id = brand_id;
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('product_id', id)
      .eq('user_id', req.user.user_id)
      .select('*, categories(cat_name), brands(brand_name)')
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

