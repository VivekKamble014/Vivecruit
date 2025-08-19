import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { planName, amount, userEmail, userId, userName } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const txnid = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // PayU configuration
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const productinfo = `${planName} Plan Subscription`;
    const firstname = userName || 'User';
    const email = userEmail;
    const phone = '9999999999'; // Default phone number
    const surl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu-success`;
    const furl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu-failure`;

    // Create hash string for PayU
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({
      success: true,
      txnid,
      amount,
      hash,
      key,
      salt,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl
    });
  } catch (error) {
    console.error('Error creating PayU order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
