// Script to create an admin user
require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./config/db');

async function createAdmin() {
  const email = 'admin@test.com';
  const password = 'admin123';
  const firstName = 'Admin';
  const lastName = 'User';

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists. Converting to admin...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ user_role: 'admin' })
        .eq('email', email);
      
      if (updateError) throw updateError;
      console.log('✓ User successfully converted to admin');
      console.log('\nCredentials:');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Role: admin');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        user_role: 'admin'
      }])
      .select();

    if (error) throw error;

    console.log('✓ Admin user created successfully!\n');
    console.log('Credentials:');
    console.log('───────────');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: admin');
    console.log('User ID:', data[0].user_id);
    console.log('───────────');
    console.log('\nYou can now login to http://localhost:3000 with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();

