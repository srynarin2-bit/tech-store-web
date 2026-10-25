import { NextResponse } from 'next/server';

// In-memory mock database table for demonstration & testing audit
let ordersDatabase: any[] = [];

export async function GET() {
  return NextResponse.json(ordersDatabase);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalAmount, paymentMethod, customerName } = body;

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      customerName: customerName || 'Valued Customer',
      items: items || [],
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'KHQR',
      status: 'COMPLETED',
      createdAt: new Date().toISOString()
    };

    // Push into database array (or Prisma database model)
    ordersDatabase.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order successfully recorded with payment',
      order: newOrder
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
  }
}