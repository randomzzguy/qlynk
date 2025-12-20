'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, supabase } from '@/lib/supabase';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import QlynkBackground from '@/components/QlynkBackground';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error?.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Success! Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setLinkSent(true);
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
            <h1 className="text-3xl font-black text-cream mb-2">Welcome Back</h1>
            <p className="text-beige">Log in to manage your qlynk page</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          {linkSent && (
            <div className="mb-6 p-4 bg-green/10 border-2 border-green/20 rounded-xl text-green text-sm">
              Magic link sent. Check your email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-bold text-cream mb-2">
                Email
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block font-bold text-cream">
                  Password
                </label>
                <Link href="#" className="text-sm text-orange hover:underline font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-bright-orange focus:outline-none transition-all pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-panel-grey hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                  Logging In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Log In
                </>
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="text-orange font-semibold hover:underline"
              >
                Send magic link instead
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 text-center">
            <p className="text-beige">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-orange font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-beige hover:text-cream transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}