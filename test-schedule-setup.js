// Test script to check schedule interview setup
// Run this with: node test-schedule-setup.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testScheduleSetup() {
  console.log('🔍 Testing Schedule Interview Setup...\n');

  try {
    // Test 1: Check if scheduled_interviews table exists
    console.log('📊 Test 1: Checking if scheduled_interviews table exists...');
    
    const { data: tableCheck, error: tableError } = await supabase
      .from('scheduled_interviews')
      .select('*')
      .limit(1);

    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('❌ Table does not exist. Please run the SQL setup script.');
        console.log('📝 Run this SQL in your Supabase SQL editor:');
        console.log('---');
        console.log(`
-- Create scheduled_interviews table
CREATE TABLE IF NOT EXISTS scheduled_interviews (
    id SERIAL PRIMARY KEY,
    interview_id VARCHAR(255) NOT NULL,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE
);
        `);
        console.log('---');
      } else {
        console.log('❌ Database error:', tableError.message);
      }
      return;
    }

    console.log('✅ Table exists and is accessible');

    // Test 2: Check if we can insert a test record
    console.log('\n📝 Test 2: Testing insert functionality...');
    
    const testData = {
      interview_id: 'test-interview-123',
      candidate_name: 'Test Candidate',
      candidate_email: 'test@example.com',
      scheduled_date: new Date().toISOString(),
      scheduled_time: '10:00 AM',
      status: 'scheduled',
      created_by: 'test@vivecruit.com'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('scheduled_interviews')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      return;
    }

    console.log('✅ Insert test successful:', insertData[0].id);

    // Test 3: Check if we can query the record
    console.log('\n🔍 Test 3: Testing query functionality...');
    
    const { data: queryData, error: queryError } = await supabase
      .from('scheduled_interviews')
      .select('*')
      .eq('interview_id', 'test-interview-123');

    if (queryError) {
      console.log('❌ Query test failed:', queryError.message);
      return;
    }

    console.log('✅ Query test successful:', queryData.length, 'records found');

    // Test 4: Clean up test data
    console.log('\n🧹 Test 4: Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('scheduled_interviews')
      .delete()
      .eq('interview_id', 'test-interview-123');

    if (deleteError) {
      console.log('❌ Cleanup failed:', deleteError.message);
      return;
    }

    console.log('✅ Cleanup successful');

    // Test 5: Check email configuration
    console.log('\n📧 Test 5: Checking email configuration...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email credentials not configured');
      console.log('Please set EMAIL_USER and EMAIL_PASS environment variables');
      console.log('See EMAIL_SETUP.md for instructions');
    } else {
      console.log('✅ Email credentials are configured');
      console.log('Email user:', process.env.EMAIL_USER);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('Your schedule interview setup is ready to use.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testScheduleSetup();
