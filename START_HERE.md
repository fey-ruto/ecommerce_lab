# ⚡️ START HERE

## Current Status

✅ **.env file created** with your Supabase credentials  
✅ **Backend dependencies installed**  
⚠️ **Database schema needs to be created**

## Next Steps (5 minutes)

### 1. Set Up Database (2 minutes)

1. Open: https://supabase.com/dashboard/project/vjwylcblmecnvosmwdku
2. Click **SQL Editor** → **New Query**
3. Open `sql/create_tables.sql` in your code editor
4. Copy all the SQL
5. Paste into Supabase SQL Editor
6. Click **Run** ✓

### 2. Install Client Dependencies (1 minute)

```bash
cd client && npm install && cd ..
```

### 3. Start the App (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

### 4. Create Admin (1 minute)

1. Register at http://localhost:3000/register
2. In Supabase: Table Editor → users → change user_role to "admin"
3. Logout and login again

## Done! 🎉

You now have:
- ✅ Database connected to Supabase
- ✅ Admin user account
- ✅ Full e-commerce platform running

## Quick Commands

```bash
# Start everything
npm run dev

# Test database connection
node server/test-connection.js

# Check if .env exists
ls -la .env
```

Your database connection string:
```
postgresql://postgres:Ecommerce_Lab1234@db.vjwylcblmecnvosmwdku.supabase.co:5432/postgres
```

---

**Action Required**: Run the SQL schema in Supabase now! ↑

