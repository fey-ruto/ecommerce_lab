-- E-Commerce Platform Database Schema
-- PostgreSQL (Supabase) with proper user/admin separation

-- ========================================
-- USERS TABLE
-- Stores both regular users and admins with role-based access
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    user_role VARCHAR(20) DEFAULT 'user' CHECK (user_role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);

-- ========================================
-- REGULAR USERS VIEW
-- Provides a view for regular (non-admin) users only
-- ========================================
CREATE OR REPLACE VIEW regular_users AS
SELECT user_id, email, first_name, last_name, created_at
FROM users
WHERE user_role = 'user';

-- ========================================
-- ADMIN USERS VIEW  
-- Provides a view for admin users only
-- ========================================
CREATE OR REPLACE VIEW admin_users AS
SELECT user_id, email, first_name, last_name, created_at
FROM users
WHERE user_role = 'admin';

-- ========================================
-- CATEGORIES TABLE
-- Categories created by admin users
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
    cat_id BIGSERIAL PRIMARY KEY,
    cat_name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cat_name, user_id)
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- ========================================
-- BRANDS TABLE
-- Brands belong to categories and are managed by admins
-- ========================================
CREATE TABLE IF NOT EXISTS brands (
    brand_id BIGSERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    cat_id BIGINT NOT NULL REFERENCES categories(cat_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_name, cat_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_brands_cat ON brands(cat_id);
CREATE INDEX IF NOT EXISTS idx_brands_user ON brands(user_id);

-- ========================================
-- PRODUCTS TABLE
-- Products with categories and brands
-- ========================================
CREATE TABLE IF NOT EXISTS products (
    product_id BIGSERIAL PRIMARY KEY,
    product_title VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_description TEXT,
    product_image VARCHAR(500),
    product_keyword VARCHAR(255),
    cat_id BIGINT NOT NULL REFERENCES categories(cat_id) ON DELETE CASCADE,
    brand_id BIGINT NOT NULL REFERENCES brands(brand_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_cat ON products(cat_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);

-- ========================================
-- AUTO-UPDATE UPDATED_AT TIMESTAMP
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- HELPER FUNCTIONS FOR USER MANAGEMENT
-- ========================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(check_user_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE user_id = check_user_id 
        AND user_role = 'admin'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is regular user
CREATE OR REPLACE FUNCTION is_user_regular(check_user_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE user_id = check_user_id 
        AND user_role = 'user'
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- For additional security in Supabase
-- ========================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own categories
CREATE POLICY "Users can view own categories" ON categories
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Only admins can insert categories
CREATE POLICY "Only admins can insert categories" ON categories
    FOR INSERT
    WITH CHECK (is_user_admin(auth.uid()::BIGINT));

-- Policy: Only admins can update their own categories
CREATE POLICY "Admins can update own categories" ON categories
    FOR UPDATE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- Policy: Only admins can delete their own categories
CREATE POLICY "Admins can delete own categories" ON categories
    FOR DELETE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- Enable RLS on brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own brands
CREATE POLICY "Users can view own brands" ON brands
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Only admins can insert brands
CREATE POLICY "Only admins can insert brands" ON brands
    FOR INSERT
    WITH CHECK (is_user_admin(auth.uid()::BIGINT));

-- Policy: Only admins can update their own brands
CREATE POLICY "Admins can update own brands" ON brands
    FOR UPDATE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- Policy: Only admins can delete their own brands
CREATE POLICY "Admins can delete own brands" ON brands
    FOR DELETE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view products (for browsing)
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT
    USING (true);

-- Policy: Only admins can insert products
CREATE POLICY "Only admins can insert products" ON products
    FOR INSERT
    WITH CHECK (is_user_admin(auth.uid()::BIGINT));

-- Policy: Only admins can update their own products
CREATE POLICY "Admins can update own products" ON products
    FOR UPDATE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- Policy: Only admins can delete their own products
CREATE POLICY "Admins can delete own products" ON products
    FOR DELETE
    USING (is_user_admin(auth.uid()::BIGINT) AND auth.uid() = user_id);

-- ========================================
-- SAMPLE DATA (Optional)
-- Uncomment to insert sample data
-- ========================================

/*
-- Insert a sample admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, user_role)
VALUES (
    'admin@example.com',
    '$2a$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
    'Admin',
    'User',
    'admin'
);

-- Insert a sample regular user (password: user123)
INSERT INTO users (email, password_hash, first_name, last_name, user_role)
VALUES (
    'user@example.com',
    '$2a$10$YourBcryptHashHere', -- Replace with actual bcrypt hash
    'Regular',
    'User',
    'user'
);
*/

-- ========================================
-- SUMMARY
-- ========================================
-- Tables Created:
-- 1. users - Stores all users (both admins and regular users)
-- 2. categories - Product categories (managed by admins)
-- 3. brands - Product brands organized by category (managed by admins)
-- 4. products - Product catalog (viewable by all, manageable by admins)
--
-- Views Created:
-- 1. regular_users - View of non-admin users only
-- 2. admin_users - View of admin users only
--
-- Functions Created:
-- 1. update_updated_at_column() - Auto-updates timestamps
-- 2. is_user_admin(user_id) - Checks if user is admin
-- 3. is_user_regular(user_id) - Checks if user is regular user
--
-- Security:
-- - Row Level Security (RLS) enabled on all tables
-- - Policies ensure data isolation per user
-- - Only admins can manage categories, brands, and products
-- ========================================
