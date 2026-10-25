import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ success: true, updatedId: params.id, data: body });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, deletedId: params.id });
}