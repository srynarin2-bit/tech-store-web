import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, paymentMethod, totalAmount, customerName } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Simulate payment gateway verification (ABA / Bakong KHQR or Credit Card)
    const transactionRecord = {
      transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      status: 'SUCCESS',
      paymentMethod: paymentMethod || 'KHQR', // 'KHQR' or 'CARD'
      totalAmount,
      customerName: customerName || 'Guest Customer',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified and processed successfully',
      transaction: transactionRecord
    });
  } catch (error) {
    return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
  }
}