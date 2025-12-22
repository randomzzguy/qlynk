import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password, username, hcaptchaToken } = await request.json();

  // Verify hCaptcha token
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', hcaptchaToken);

  try {
    const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      body: params,
    });

    const hcaptchaData = await hcaptchaResponse.json();

    if (!hcaptchaData.success) {
      return NextResponse.json(
        { message: 'hCaptcha verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Proceed with signup
    const supabase = createClient();
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
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Signup successful! Please check your email to verify your account.' });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}