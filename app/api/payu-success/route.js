import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/services/supabaseClient';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const txnid = formData.get('txnid');
    const amount = formData.get('amount');
    const productinfo = formData.get('productinfo');
    const firstname = formData.get('firstname');
    const email = formData.get('email');
    const mihpayid = formData.get('mihpayid');
    const status = formData.get('status');
    const hash = formData.get('hash');
    const udf1 = formData.get('udf1'); // planName
    const udf2 = formData.get('udf2'); // userEmail
    const udf3 = formData.get('udf3'); // userId

    // Verify hash
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const hashString = `${salt}|${status}|||||||||||${udf3}|${udf2}|${udf1}|${mihpayid}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (calculatedHash !== hash) {
      console.error('Hash verification failed');
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=failed&error=hash_mismatch`);
    }

    if (status === 'success') {
      // Update user plan in database
      try {
        const { error } = await supabase
          .from('Users')
          .update({
            plan: udf1,
            plan_updated_at: new Date().toISOString(),
            payment_id: mihpayid,
            order_id: txnid,
          })
          .eq('email', udf2);

        if (error) {
          console.error('Error updating user plan:', error);
          return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=failed&error=db_update`);
        }

        // Log the successful payment
        const { error: logError } = await supabase
          .from('payments')
          .insert([
            {
              user_email: udf2,
              user_id: udf3,
              plan_name: udf1,
              payment_id: mihpayid,
              order_id: txnid,
              amount: parseInt(amount),
              status: 'completed',
              payment_date: new Date().toISOString(),
            },
          ]);

        if (logError) {
          console.error('Error logging payment:', logError);
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=success&plan=${udf1}`);
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=failed&error=database`);
      }
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=failed&error=payment_failed`);
    }
  } catch (error) {
    console.error('Error in PayU success callback:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/billing?status=failed&error=unknown`);
  }
}

export async function GET(req) {
  // Handle GET requests (PayU sometimes sends GET requests)
  return POST(req);
}
