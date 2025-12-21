
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password, username, hcaptchaToken } = await request.json();

  const supabase = createRouteHandlerClient({ cookies });

  // Verify hCaptcha token
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  const response = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `response=${hcaptchaToken}&secret=${secret}`,
  });
  const data = await response.json();

  if (!data.success) {
    return NextResponse.json({ error: 'hCaptcha verification failed.' }, { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Signup successful, please check your email to confirm.' });
}