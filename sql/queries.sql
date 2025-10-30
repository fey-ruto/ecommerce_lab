-- ========================================
-- USEFUL QUERIES FOR THE E-COMMERCE APP
-- ========================================

-- ========================================
-- USER MANAGEMENT QUERIES
-- ========================================

-- Get all admin users
SELECT * FROM admin_users;

-- Get all regular users
SELECT * FROM regular_users;

-- Check if a user is admin
SELECT is_user_admin(1); -- Returns true if user_id 1 is admin

-- Get user details by email
SELECT user_id, email, first_name, last_name, user_role, created_at
FROM users
WHERE email = 'user@example.com';

-- Change a user to admin
UPDATE users SET user_role = 'admin' WHERE email = 'user@example.com';

-- ========================================
-- CATEGORY QUERIES
-- ========================================

-- Get all categories for a specific admin
SELECT c.cat_id, c.cat_name, u.email as created_by, c.created_at
FROM categories c
JOIN users u ON c.user_id = u.user_id
WHERE u.user_id = 1;

-- Count products per category (viewable by all)
SELECT 
    c.cat_name,
    COUNT(p.product_id) as product_count
FROM categories c
LEFT JOIN products p ON c.cat_id = p.cat_id
GROUP BY c.cat_id, c.cat_name
ORDER BY product_count DESC;

-- ========================================
-- BRAND QUERIES
-- ========================================

-- Get all brands with their categories
SELECT 
    b.brand_id,
    b.brand_name,
    c.cat_name as category,
    u.email as created_by
FROM brands b
JOIN categories c ON b.cat_id = c.cat_id
JOIN users u ON b.user_id = u.user_id;

-- Get brands for a specific category
SELECT b.brand_id, b.brand_name
FROM brands b
JOIN categories c ON b.cat_id = c.cat_id
WHERE c.cat_name = 'Footwear'
ORDER BY b.brand_name;

-- Count products per brand
SELECT 
    b.brand_name,
    c.cat_name as category,
    COUNT(p.product_id) as product_count
FROM brands b
JOIN categories c ON b.cat_id = c.cat_id
LEFT JOIN products p ON b.brand_id = p.brand_id
GROUP BY b.brand_id, b.brand_name, c.cat_name
ORDER BY product_count DESC;

-- ========================================
-- PRODUCT QUERIES
-- ========================================

-- Get all products with category and brand details
SELECT 
    p.product_id,
    p.product_title,
    p.product_price,
    c.cat_name as category,
    b.brand_name as brand,
    u.email as created_by
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
JOIN users u ON p.user_id = u.user_id
ORDER BY p.created_at DESC;

-- Search products by keyword (used by search functionality)
SELECT *
FROM products
WHERE 
    product_title ILIKE '%keyword%' 
    OR product_description ILIKE '%keyword%'
    OR product_keyword ILIKE '%keyword%';

-- Get products by category
SELECT p.*, c.cat_name, b.brand_name
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
WHERE c.cat_id = 1;

-- Get products by brand
SELECT p.*, c.cat_name, b.brand_name
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
WHERE b.brand_id = 1;

-- Get expensive products (top 10)
SELECT 
    p.product_id,
    p.product_title,
    p.product_price,
    c.cat_name,
    b.brand_name
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
ORDER BY p.product_price DESC
LIMIT 10;

-- ========================================
-- ADMIN DASHBOARD QUERIES
-- ========================================

-- Summary statistics for admin dashboard
SELECT 
    (SELECT COUNT(*) FROM users WHERE user_role = 'admin') as total_admins,
    (SELECT COUNT(*) FROM users WHERE user_role = 'user') as total_users,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM brands) as total_brands,
    (SELECT COUNT(*) FROM products) as total_products;

-- Products created by specific admin
SELECT 
    product_id,
    product_title,
    product_price,
    created_at
FROM products
WHERE user_id = 1
ORDER BY created_at DESC;

-- Categories with no products
SELECT c.cat_id, c.cat_name
FROM categories c
LEFT JOIN products p ON c.cat_id = p.cat_id
WHERE p.product_id IS NULL;

-- Brands with no products
SELECT b.brand_id, b.brand_name, c.cat_name
FROM brands b
JOIN categories c ON b.cat_id = c.cat_id
LEFT JOIN products p ON b.brand_id = p.brand_id
WHERE p.product_id IS NULL;

-- ========================================
-- CUSTOMER-FACING QUERIES
-- ========================================

-- Recent products (latest 10)
SELECT p.*, c.cat_name, b.brand_name
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
ORDER BY p.created_at DESC
LIMIT 10;

-- Featured products (you can modify this query as needed)
SELECT p.*, c.cat_name, b.brand_name
FROM products p
JOIN categories c ON p.cat_id = c.cat_id
JOIN brands b ON p.brand_id = b.brand_id
WHERE p.product_price BETWEEN 10 AND 100
ORDER BY RANDOM()
LIMIT 5;

-- Get all categories with product counts
SELECT 
    c.cat_id,
    c.cat_name,
    COUNT(p.product_id) as product_count
FROM categories c
LEFT JOIN products p ON c.cat_id = p.cat_id
GROUP BY c.cat_id, c.cat_name
HAVING COUNT(p.product_id) > 0
ORDER BY c.cat_name;

-- ========================================
-- CLEANUP QUERIES (Admin Only)
-- ========================================

-- Delete all products for a specific category
DELETE FROM products WHERE cat_id = 1;

-- Delete all brands for a specific category
DELETE FROM brands WHERE cat_id = 1;

-- Delete a category and all its brands (cascade)
DELETE FROM categories WHERE cat_id = 1;

-- ========================================
-- SAMPLE TEST DATA
-- ========================================
-- Uncomment and modify as needed for testing

/*
-- Insert test categories
INSERT INTO categories (cat_name, user_id) VALUES
('Footwear', 1),
('Electronics', 1),
('Clothing', 1);

-- Insert test brands
INSERT INTO brands (brand_name, cat_id, user_id) VALUES
('Nike', 1, 1),
('Adidas', 1, 1),
('Puma', 1, 1);

-- Insert test products
INSERT INTO products (
    product_title, 
    product_price, 
    product_description, 
    product_keyword,
    cat_id, 
    brand_id, 
    user_id
) VALUES
('Air Max 90', 129.99, 'Classic running shoes', 'shoes running nike', 1, 1, 1),
('Stan Smith', 79.99, 'Iconic tennis shoes', 'tennis shoes adidas', 1, 2, 1);
*/

