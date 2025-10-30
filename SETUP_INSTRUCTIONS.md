# Quick Setup Instructions

## 1. Create .env File

Create a `.env` file in the root directory (`/Users/jep/ecommerce_lab/.env`) with these contents:

```env
SUPABASE_URL=https://vjwylcblmecnvosmwdku.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd3lsY2JsbWVjbnZvc213ZGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzA3MTQsImV4cCI6MjA3NzE0NjcxNH0.B6W_HU1ewIGUk0G7wYUVpCnqPOu5VOL6K8IIdvF5lkg
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## 2. Set Up Database Schema

Go to your Supabase dashboard:
1. Navigate to **SQL Editor**
2. Copy and paste the entire contents of `sql/create_tables.sql`
3. Click **Run** to execute

This will create all tables, views, functions, and security policies.

## 3. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## 4. Run the Application

```bash
# Start both server and client
npm run dev

# Or run separately:
npm run server    # Backend on http://localhost:5000
cd client && npm start  # Frontend on http://localhost:3000
```

## 5. Create Your First Admin User

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Go to your Supabase dashboard → Table Editor → users
4. Find your newly created user
5. Change `user_role` from `user` to `admin`
6. Go back to the app, logout and login again
7. You should now see admin options in the navbar

## Quick Connection Test

You can test your database connection by running:

```bash
node server/test-connection.js
```

## Your Supabase Connection Details

- **Host**: db.vjwylcblmecnvosmwdku.supabase.co
- **Database**: postgres
- **Port**: 5432
- **Username**: postgres
- **Password**: Ecommerce_Lab1234

## Next Steps

1. Run `npm install` to install dependencies
2. Create the `.env` file with your credentials
3. Run the SQL schema in Supabase
4. Start the app with `npm run dev`
5. Register and convert to admin as described above

