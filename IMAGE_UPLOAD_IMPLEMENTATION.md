# Image Upload Implementation Guide

## ✅ What Was Implemented

### Backend (Server)
1. **Upload Route** (`server/routes/upload.js`)
   - Multer configuration for file uploads
   - Security checks to ensure files only go to `uploads/` directory
   - Organized directory structure: `uploads/u{userId}/p{productId}/`
   - File validation (only images: jpeg, jpg, png, gif, webp)
   - File size limit: 10MB
   - Unique filename generation with timestamps

2. **Server Setup** (`server/index.js`)
   - Added multer route for image uploads
   - Static file serving for uploaded images
   - Security verification of upload paths

### Frontend (React)
1. **Product Management** (`client/src/pages/admin/ProductManagement.js`)
   - Image file input with preview
   - Image preview before upload
   - Upload to `/api/upload/product` after product creation
   - Display existing images when editing

2. **Product Display**
   - `AllProducts.js` - Shows product images in grid
   - `SingleProduct.js` - Shows large product image
   - `SearchResults.js` - Shows images in search results

## 📁 Directory Structure

Uploaded images are stored in this structure:
```
uploads/
├── u{userId}/           # User directory
    └── p{productId}/    # Product directory
        ├── image_1234567890-123456789.png
        ├── image_1234567891-123456790.jpg
        └── ...
```

Example:
```
uploads/
├── u2/
    └── p5/
        └── image_1698765432-987654321.png
```

## 🔐 Security Features

1. **Path Validation**
   - Verifies files are within `uploads/` directory
   - Prevents directory traversal attacks
   - Rejects uploads outside authorized location

2. **File Type Validation**
   - Only allows image files
   - Checks MIME type and file extension
   - Rejects non-image files

3. **Size Limits**
   - Maximum file size: 10MB
   - Prevents server overload

4. **Admin Only**
   - Image upload requires admin authentication
   - Uses `authenticate` and `isAdmin` middleware

## 🚀 How to Use

### As Admin:

1. **Add Product with Image**
   - Go to "Add Product" page
   - Fill in product details
   - Click "Choose File" to select an image
   - Preview will show
   - Submit the form
   - Image uploads automatically

2. **Edit Product Image**
   - Edit a product that has an image
   - Existing image shows in preview
   - Select new file to replace it
   - Submit changes

### Image Storage in Database

The `products` table stores the relative path:
```
product_image: "uploads/u2/p5/image_1698765432-987654321.png"
```

### Image Display

Images are served from: `http://localhost:5001/uploads/{path}`

Frontend accesses them via: `/{product.product_image}`

## 📝 API Endpoints

### Upload Image
```http
POST /api/upload/product
Content-Type: multipart/form-data

Body:
- image: [file]
- product_id: [number]

Headers:
- Authorization: [JWT token in cookie]
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "image_path": "uploads/u2/p5/image_123.png",
  "filename": "image_123.png"
}
```

### View Image
```http
GET http://localhost:5001/uploads/{relative_path}
```

## 🎯 Features

- ✅ File upload with Multer
- ✅ Image preview before upload
- ✅ Security path validation
- ✅ File type validation
- ✅ Size limit (10MB)
- ✅ Unique filename generation
- ✅ Organized directory structure
- ✅ Admin-only access
- ✅ Image display on product pages
- ✅ Product edit with image update
- ✅ Static file serving

## 🐛 Troubleshooting

### "Upload directory not found"
Run: `mkdir -p uploads` in the project root

### "Invalid upload location"
The backend blocks files outside `uploads/` directory for security

### Images not showing
1. Check image path in database
2. Verify file exists in `uploads/` directory
3. Check server console for errors
4. Ensure static file serving is enabled

### Upload fails
1. Check file size (max 10MB)
2. Verify file type (images only)
3. Ensure admin role is set
4. Check server logs for errors

## 📊 Database Schema

Product images are stored in the `product_image` field:

```sql
product_image VARCHAR(500)  -- Stores relative path from uploads/
```

Example values:
- `uploads/u2/p5/image_123.png`
- `uploads/u3/p12/image_456.jpg`

## 🎨 UI Features

- File input with drag-and-drop styling
- Image preview before submission
- Loading states during upload
- Success/error messages
- Edit with existing image preview
- Responsive image display in product cards

---

**Status: ✅ Fully Implemented and Ready to Use**

