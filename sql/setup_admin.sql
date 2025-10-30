-- ========================================
-- QUICK ADMIN SETUP
-- Run this after creating your first user
-- ========================================

-- Option 1: Convert an existing user to admin by email
UPDATE users 
SET user_role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: Convert a user to admin by user_id
UPDATE users 
SET user_role = 'admin' 
WHERE user_id = 1;

-- Option 3: Convert first registered user to admin
UPDATE users 
SET user_role = 'admin' 
WHERE user_id = (SELECT MIN(user_id) FROM users);

-- ========================================
-- VIEW ALL ADMINS
-- ========================================
SELECT user_id, email, first_name, last_name, created_at 
FROM admin_users;

-- ========================================
-- VIEW ALL REGULAR USERS
-- ========================================
SELECT user_id, email, first_name, last_name, created_at 
FROM regular_users;

-- ========================================
-- COUNT USERS BY ROLE
-- ========================================
SELECT 
    user_role,
    COUNT(*) as count
FROM users
GROUP BY user_role;

-- ========================================
-- CHECK IF SPECIFIC USER IS ADMIN
-- ========================================
SELECT is_user_admin(1); -- Returns true/false for user_id = 1

-- ========================================
-- REMOVE ADMIN PRIVILEGES
-- ========================================
UPDATE users 
SET user_role = 'user' 
WHERE email = 'admin@example.com';

-- ========================================
-- CREATE ADMIN USER DIRECTLY
-- (After user registration in the app)
-- ========================================
-- 1. Register normally through the app
-- 2. Then run: UPDATE users SET user_role = 'admin' WHERE email = 'your@email.com';

