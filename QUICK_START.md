# 🚀 Quick Start Guide

Your `.env` file is created and connection to Supabase is working! Now follow these steps:

## Step 1: Set Up Database Schema in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vjwylcblmecnvosmwdku
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file `sql/create_tables.sql` in this project
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** or press `Ctrl/Cmd + Enter`

This creates:
- ✅ users table
- ✅ categories table  
- ✅ brands table
- ✅ products table
- ✅ Views for regular_users and admin_users
- ✅ Security policies (RLS)
- ✅ Helper functions

## Step 2: Install Client Dependencies

```bash
cd client
npm install
cd ..
```

## Step 3: Start the Application

```bash
npm run dev
```

This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

## Step 4: Create Your First Admin

1. Open http://localhost:3000
2. Click **Register**
3. Create your account (e.g., jep@example.com)
4. Go to Supabase dashboard → **Table Editor** → **users**
5. Find your user record
6. Click on the `user_role` field (it says "user")
7. Change it to "admin"
8. Go back to the app, **Logout** and **Login** again
9. You should now see admin buttons in the navbar!

## Step 5: Test the Application

As Admin, you can now:
- ✅ Manage Categories (http://localhost:3000/admin/categories)
- ✅ Manage Brands (http://localhost:3000/admin/brands)
- ✅ Add Products (http://localhost:3000/admin/products)
- ✅ Browse Products (http://localhost:3000/products)

## Your Supabase Connection ✅

- **URL**: https://vjwylcblmecnvosmwdku.supabase.co
- **Database**: postgres  
- **Status**: Connected ✓
- **Need**: Run SQL schema (Step 1 above)

## Troubleshooting

### "Cannot find module" error
Run: `npm install` in the root directory

### Connection test fails
- Make sure you've run the SQL schema from Step 1
- Check that .env file exists

### Can't see admin features
- Make sure user_role = 'admin' in Supabase
- Logout and login again after changing role

## Next: Run the SQL Schema!

Go to Supabase → SQL Editor and run `sql/create_tables.sql` now!

