import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function POST(req) {
  try {
    const { name, email, subject, message, phone, company } = await req.json();

    console.log('Contact form submission received:', { name, email, subject, message, phone, company });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing required fields:', { name, email, subject, message });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Attempting to insert into database...');

    // Insert contact submission
    const { data, error } = await supabase
      .from('contact_us')
      .insert([
        {
          name,
          email,
          subject,
          message,
          phone: phone || null,
          company: company || null,
          status: 'unread',
          priority: 'normal'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error inserting contact submission:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to submit contact form', error: error.message },
        { status: 500 }
      );
    }

    console.log('Contact submission successful:', data);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Check if admin is authenticated (you can add more validation here)
    const { searchParams } = new URL(req.url);
    const adminKey = searchParams.get('admin_key');
    
    // Simple admin key validation (you can make this more secure)
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch contact submissions
    const { data, error } = await supabase
      .from('contact_us')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact submissions:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch contact submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in contact GET API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
