'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase, checkUsernameAvailable } from '@/lib/supabase';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { Suspense } from 'react';
import QlynkBackground from '@/components/QlynkBackground';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    username: searchParams.get('username') || '',
    email: searchParams.get('email') || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.username || !formData.email) {
      setError('All fields are required');
      return false;
    }

    // Username validation
    if (formData.username.length < 3 || formData.username.length > 30) {
      setError('Username must be between 3 and 30 characters');
      return false;
    }

    if (!/^[a-z0-9_-]+$/.test(formData.username)) {
      setError('Username can only contain lowercase letters, numbers, hyphens, and underscores');
      return false;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const available = await checkUsernameAvailable(formData.username);
      if (!available) {
        setError('Username already taken');
        setLoading(false);
        return;
      }
      localStorage.setItem('qlynk_pending_username', formData.username);
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/create`,
          shouldCreateUser: true
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setNeedsVerification(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-6">
      <QlynkBackground />

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-8 group">
          <Image
            src="/assets/logo.svg"
            alt="qlynk logo"
            width={125}
            height={50}
            priority
            className="group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Card */}
        <div className="semi-translucent-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-cream mb-2">Create Your Account</h1>
            <p className="text-beige">Start building your presence in minutes</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {!needsVerification ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block font-bold text-cream mb-2">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="your-username"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-bright-orange focus:outline-none transition-all"
                disabled={loading}
              />
              <p className="text-xs text-white mt-1.5 ml-1">
                Your page will be at: qlynk.site/{formData.username || 'username'}
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-bold text-cream mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-bright-orange focus:outline-none transition-all"
                disabled={loading}
              />
            </div>

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                loading
                  ? 'semi-translucent-button text-cream opacity-75 cursor-wait'
                  : 'semi-translucent-button text-cream hover:shadow-xl hover:shadow-orange/40'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>
          ) : (
            <div className="space-y-5 text-center">
              <h2 className="text-2xl font-black text-cream">Check Your Email</h2>
              <p className="text-beige">We sent a magic link to {formData.email}. Open it to sign in and continue.</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="semi-translucent-button text-cream px-6 py-3 rounded-xl font-bold"
                >
                  Log In
                </button>
                <button
                  onClick={() => setNeedsVerification(false)}
                  className="semi-translucent-button-secondary text-cream px-6 py-3 rounded-xl font-bold"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 text-center">
            <p className="text-beige">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-orange font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-beige mt-6">
          By signing up, you agree to our{' '}
          <Link href="#" className="text-cream hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="#" className="text-cream hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}