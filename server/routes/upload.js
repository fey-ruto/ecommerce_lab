const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, isAdmin } = require('../middleware/auth');
const supabase = require('../config/db');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.user_id;
    const productId = req.body.product_id || 'temp';
    
    // Create user-specific directory: uploads/u{userId}/p{productId}/
    const userDir = path.join(uploadsDir, `u${userId}`);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    const productDir = path.join(userDir, `p${productId}`);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    cb(null, productDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image_${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: fileFilter
});

// Upload product image endpoint
router.post('/product', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { product_id } = req.body;
    
    if (!product_id) {
      // Delete uploaded file if no product_id
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Product ID required' });
    }

    // Verify the file is within uploads directory (security check)
    const normalizedPath = path.normalize(req.file.path);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    
    if (!normalizedPath.startsWith(normalizedUploadsDir)) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Invalid upload location' });
    }

    // Construct relative path for database storage
    const relativePath = `uploads/${path.relative(uploadsDir, req.file.path)}`;
    
    // Update product with image path
    const { error } = await supabase
      .from('products')
      .update({ product_image: relativePath })
      .eq('product_id', product_id)
      .eq('user_id', req.user.user_id);

    if (error) {
      // Delete file if database update fails
      fs.unlinkSync(req.file.path);
      throw error;
    }

    res.json({
      message: 'Image uploaded successfully',
      image_path: relativePath,
      filename: req.file.filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product image endpoint
router.get('/product/:path(*)', (req, res) => {
  try {
    const { path: imagePath } = req.params;
    const fullPath = path.join(uploadsDir, imagePath.replace('uploads/', ''));
    
    // Security check - ensure path is still within uploads directory
    const normalizedPath = path.normalize(fullPath);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    
    if (!normalizedPath.startsWith(normalizedUploadsDir)) {
      return res.status(403).json({ error: 'Invalid file path' });
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(fullPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

