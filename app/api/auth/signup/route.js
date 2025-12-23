import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, username, hcaptchaToken } = await request.json();

    // Verify hCaptcha token
    const secret = process.env.HCAPTCHA_SECRET;
    const isLocalBypass = hcaptchaToken === 'local-bypass';

    if (!isLocalBypass) {
      if (!secret) {
        console.warn('HCAPTCHA_SECRET is missing, but hcaptchaToken provided. Bypassing verification.');
      } else {
        const params = new URLSearchParams();
        params.append('secret', secret);
        params.append('response', hcaptchaToken);

        const hcaptchaResponse = await fetch('https://hcaptcha.com/siteverify', {
          method: 'POST',
          body: params,
        });

        const hcaptchaData = await hcaptchaResponse.json();

        if (!hcaptchaData.success) {
          console.error('hCaptcha verification failed:', hcaptchaData);
          return NextResponse.json(
            { message: 'hCaptcha verification failed. Please try again.' },
            { status: 400 }
          );
        }
      }
    }

    // Proceed with signup
    const supabase = await createClient();
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
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}