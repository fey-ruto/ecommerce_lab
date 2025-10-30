# E-Commerce Platform Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Set Up Supabase

1. Go to https://supabase.com and create an account
2. Create a new project
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the contents of `sql/create_tables.sql` and run it
5. Get your credentials from **Project Settings > API**:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Secret (use a strong random string)
JWT_SECRET=your-secret-key-change-this-in-production

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Create Upload Directory

```bash
mkdir -p uploads
```

### 5. Run the Application

```bash
# Start both server and client
npm run dev

# Or run them separately:
npm run server   # Backend on http://localhost:5000
cd client && npm start  # Frontend on http://localhost:3000
```

## Creating an Admin User

1. Register a user through the UI at http://localhost:3000/register
2. Go to your Supabase dashboard
3. Navigate to **Table Editor** > **users**
4. Find your newly registered user
5. Click on the `user_role` field
6. Change it from `user` to `admin`
7. Logout and login again in the app to get admin privileges

## Features

### Regular Users Can:
- Browse all products
- Search products
- Filter by category and brand
- View product details

### Admin Users Can:
- Everything regular users can do
- Manage categories (CRUD)
- Manage brands (CRUD)
- Add and edit products
- View their own products

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Categories (Admin only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Brands (Admin only)
- `GET /api/brands` - Get all brands
- `GET /api/brands/category/:cat_id` - Get brands by category
- `POST /api/brands` - Add brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search/:query` - Search products
- `GET /api/products/filter/category/:cat_id` - Filter by category
- `GET /api/products/filter/brand/:brand_id` - Filter by brand
- `GET /api/products/my-products` - Get admin's products
- `POST /api/products` - Add product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)

## Tech Stack

- **Backend**: Node.js, Express, Supabase (PostgreSQL)
- **Frontend**: React, React Router, Axios
- **Authentication**: JWT, bcryptjs
- **Styling**: CSS with modern gradients and animations

## Project Structure

```
ecommerce_lab/
├── server/
│   ├── index.js              # Main server file
│   ├── config/
│   │   └── db.js             # Supabase connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── routes/
│       ├── auth.js           # Auth routes
│       ├── category.js       # Category CRUD
│       ├── brand.js          # Brand CRUD
│       └── product.js        # Product management
├── client/
│   ├── public/
│   └── src/
│       ├── components/       # React components
│       ├── pages/            # Page components
│       ├── contexts/         # React contexts
│       └── App.js            # Main app component
├── sql/
│   └── create_tables.sql     # Database schema
└── .env                      # Environment variables
```

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use, change the PORT in `.env` and restart.

### Database Connection Error
- Verify your Supabase credentials in `.env`
- Check that your Supabase project is active
- Ensure you've run the SQL schema

### CORS Errors
- Make sure `CLIENT_URL` in `.env` matches your frontend URL
- Check that the proxy is configured in `client/package.json`

### Can't Access Admin Pages
- Verify your user role is set to `admin` in Supabase
- Logout and login again after changing role
- Check browser console for authentication errors

## Development Tips

- The app uses cookie-based authentication
- All admin routes require authentication AND admin role
- Products, categories, and brands are scoped to the user who created them
- The search functionality searches through title, description, and keywords

