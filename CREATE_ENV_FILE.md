# Create .env File

Since `.env` files are protected for security, you need to create it manually.

## Instructions

1. Open Terminal in the project directory
2. Run this command:

```bash
cat > .env << 'EOF'
SUPABASE_URL=https://vjwylcblmecnvosmwdku.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqd3lsY2JsbWVjbnZvc213ZGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzA3MTQsImV4cCI6MjA3NzE0NjcxNH0.B6W_HU1ewIGUk0G7wYUVpCnqPOu5VOL6K8IIdvF5lkg
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EOF
```

Or create it manually:

1. Create a new file named `.env` in `/Users/jep/ecommerce_lab/`
2. Add the content above

