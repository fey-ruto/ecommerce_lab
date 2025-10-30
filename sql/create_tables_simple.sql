-- ========================================
-- E-COMMERCE DATABASE SCHEMA FOR SUPABASE
-- Ready to copy and paste into SQL Editor
-- ========================================

-- Create users table
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

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(user_role);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    cat_id BIGSERIAL PRIMARY KEY,
    cat_name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cat_name, user_id)
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- Create brands table
-- NOTE: The same brand_name can exist in multiple categories!
-- Example: "Nike" can be in both "Footwear" and "Electronics" categories
CREATE TABLE IF NOT EXISTS brands (
    brand_id BIGSERIAL PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    cat_id BIGINT NOT NULL REFERENCES categories(cat_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_name, cat_id, user_id)  -- Allows same brand in different categories
);

CREATE INDEX IF NOT EXISTS idx_brands_cat ON brands(cat_id);
CREATE INDEX IF NOT EXISTS idx_brands_user ON brands(user_id);

-- Create products table
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

-- Create auto-update function for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create views for easier querying
CREATE OR REPLACE VIEW regular_users AS
SELECT user_id, email, first_name, last_name, created_at
FROM users
WHERE user_role = 'user';

CREATE OR REPLACE VIEW admin_users AS
SELECT user_id, email, first_name, last_name, created_at
FROM users
WHERE user_role = 'admin';

-- Create helper functions
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

