# E-Commerce Platform

A full-stack e-commerce platform built with React, Node.js, and Supabase.

## Features

### User Management
- User registration and login
- Session management with JWT
- Admin and regular user roles
- Protected routes

### Admin Features
- **Category Management**: Create, read, update, and delete categories
- **Brand Management**: Create, read, update, and delete brands (organized by categories)
- **Product Management**: Add and edit products with images

### Customer Features
- View all products
- Search products by title, description, or keywords
- Filter by category and brand
- Single product detailed view

## Tech Stack

### Backend
- **Node.js** with Express
- **Supabase** PostgreSQL database
- JWT authentication
- bcryptjs for password hashing

### Frontend
- **React** with modern hooks
- React Router for navigation
- Axios for API calls
- Modern UI with styled components

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
cd ecommerce_lab
\`\`\`

### 2. Set Up Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to SQL Editor and run the schema from \`sql/create_tables.sql\`
4. Get your project URL and anon key from Project Settings > API

### 3. Install Dependencies

\`\`\`bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
\`\`\`

### 4. Configure Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`env
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-secret-key-change-this
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 5. Set Up Upload Folder

Create the uploads directory structure:

\`\`\`bash
mkdir -p uploads
\`\`\`

### 6. Run the Application

\`\`\`bash
# Start both server and client
npm run dev

# Or start separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
\`\`\`

## Database Schema

### Users
- user_id (Primary Key)
- email (Unique)
- password_hash
- first_name, last_name
- user_role ('user' or 'admin')
- created_at, updated_at

### Categories
- cat_id (Primary Key)
- cat_name
- user_id (Foreign Key)
- created_at

### Brands
- brand_id (Primary Key)
- brand_name
- cat_id (Foreign Key)
- user_id (Foreign Key)
- created_at

### Products
- product_id (Primary Key)
- product_title
- product_price
- product_description
- product_image
- product_keyword
- cat_id (Foreign Key)
- brand_id (Foreign Key)
- user_id (Foreign Key)
- created_at, updated_at

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/logout\` - Logout user
- \`GET /api/auth/me\` - Get current user

### Categories (Admin only)
- \`GET /api/categories\` - Get all categories
- \`POST /api/categories\` - Add category
- \`PUT /api/categories/:id\` - Update category
- \`DELETE /api/categories/:id\` - Delete category

### Brands (Admin only)
- \`GET /api/brands\` - Get all brands
- \`GET /api/brands/category/:cat_id\` - Get brands by category
- \`POST /api/brands\` - Add brand
- \`PUT /api/brands/:id\` - Update brand
- \`DELETE /api/brands/:id\` - Delete brand

### Products
- \`GET /api/products\` - Get all products
- \`GET /api/products/:id\` - Get single product
- \`GET /api/products/search/:query\` - Search products
- \`GET /api/products/filter/category/:cat_id\` - Filter by category
- \`GET /api/products/filter/brand/:brand_id\` - Filter by brand
- \`GET /api/products/my-products\` - Get admin's products
- \`POST /api/products\` - Add product (Admin only)
- \`PUT /api/products/:id\` - Update product (Admin only)

## Testing Admin Access

To test admin features:

1. Register a user normally
2. In Supabase, go to Table Editor > users
3. Find your user and change \`user_role\` from 'user' to 'admin'
4. Logout and login again to get admin privileges

## Project Structure

\`\`\`
ecommerce_lab/
├── server/
│   ├── index.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── category.js
│       ├── brand.js
│       └── product.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── public/
├── sql/
│   └── create_tables.sql
├── .env
└── package.json
\`\`\`

## License

This project is created for educational purposes.

