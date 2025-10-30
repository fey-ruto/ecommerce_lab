// Quick connection test for Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Present' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('✗ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection by querying a table
supabase.from('users').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('✗ Connection failed:', error.message);
      console.log('\nNote: If tables don\'t exist yet, run sql/create_tables.sql in Supabase SQL Editor');
      process.exit(1);
    } else {
      console.log('✓ Connection successful!');
      console.log('✓ Database is accessible');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('✗ Error:', err.message);
    process.exit(1);
  });

