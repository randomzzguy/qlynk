import { NextResponse } from 'next/server';

export async function POST(request) {
  const { token } = await request.json();
  if (!token) return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });

  const secret = process.env.HCAPTCHA_SECRET;
  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);

  const resp = await fetch('https://hcaptcha.com/siteverify', { method: 'POST', body: params });
  const data = await resp.json();

  if (data.success) return NextResponse.json({ success: true });
  return NextResponse.json({ success: false, error: data['error-codes'] || 'verification failed' }, { status: 403 });
}