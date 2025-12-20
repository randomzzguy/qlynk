'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Zap, Code, Palette, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const PricingPage = () => {
  const freeFeatures = [
    '5 Beautiful Themes',
    'Basic Analytics',
    'Mobile Responsive',
    'SSL Certificate',
    'Community Support'
  ];

  const proFeatures = [
    'Everything in Free, plus:',
    '3 Premium Themes',
    'Advanced Animations',
    '3D Effects & Particles',
    'Custom Domain Support',
    'Advanced Analytics',
    'Priority Support',
    'No Branding'
  ];

  const premiumThemes = [
    {
      name: 'Cosmic Flow',
      description: '3D space theme with particle constellations',
      icon: <Sparkles className="text-purple-500" size={24} />
    },
    {
      name: 'Glass Morphism',
      description: 'Advanced glass effects with depth layers',
      icon: <Palette className="text-blue-500" size={24} />
    },
    {
      name: 'Neon City',
      description: 'Cyberpunk aesthetic with animated neon lights',
      icon: <Zap className="text-cyan-500" size={24} />
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      

      <nav className="bg-white/85 border-b border-beige/30 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Image width={125} height={50} src="/assets/logo.svg" alt="qlynk logo" priority />
              </div>
            </Link>
            <Link 
              href="/auth/login"
              className="text-charcoal hover:text-dark-grey font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl lg:text-6xl font-black text-cream mb-6">
            Choose Your <span className="text-orange">Plan</span>
          </h1>
          <p className="text-xl text-cream/80 max-w-2xl mx-auto mb-12">
            Start free, then upgrade when you're ready to unlock premium themes and advanced features
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div
            className="semi-translucent-card rounded-2xl p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-cream mb-2">Free</h3>
              <div className="text-4xl font-black text-cream mb-2">$0</div>
              <p className="text-cream/80">Forever</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="text-orange" size={20} />
                  <span className="text-cream">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/auth/signup"
              className="block w-full semi-translucent-button text-cream py-3 rounded-lg font-semibold"
            >
              Get Started Free
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="semi-translucent-card rounded-2xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Popular badge */}
            <div className="absolute top-0 right-0 semi-translucent-button px-4 py-2 rounded-bl-lg font-semibold text-sm">
              <div className="flex items-center gap-1">
                <Star size={16} />
                Popular
              </div>
            </div>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="text-orange" size={24} />
                <h3 className="text-2xl font-bold text-cream">Pro</h3>
              </div>
              <div className="text-4xl font-black text-cream mb-2">$9</div>
              <p className="text-cream/80">per month</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="text-orange" size={20} />
                  <span className="text-cream">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => alert('Payment integration needed')}
              className="w-full semi-translucent-button text-cream py-3 rounded-lg font-semibold"
            >
              Upgrade to Pro
            </button>
          </motion.div>
        </div>

        {/* Premium Themes Showcase */}
        <motion.div
          className="mt-20 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-black text-cream mb-8 text-center">
            Premium <span className="text-orange">Themes</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {premiumThemes.map((theme, index) => (
              <motion.div
                key={index}
                className="semi-translucent-card rounded-xl p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {theme.icon}
                  <h3 className="font-bold text-cream">{theme.name}</h3>
                </div>
                <p className="text-cream/80 text-sm">{theme.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 text-left max-w-3xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-black text-cream mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="semi-translucent-card rounded-xl p-6">
              <h3 className="font-bold text-cream mb-2">Can I switch plans later?</h3>
              <p className="text-cream/80">Yes! You can upgrade to Pro at any time. Downgrades take effect at the end of your billing cycle.</p>
            </div>
            
            <div className="semi-translucent-card rounded-xl p-6">
              <h3 className="font-bold text-cream mb-2">What payment methods do you accept?</h3>
              <p className="text-cream/80">We accept all major credit cards, PayPal, and other popular payment methods.</p>
            </div>
            
            <div className="semi-translucent-card rounded-xl p-6">
              <h3 className="font-bold text-cream mb-2">Can I cancel anytime?</h3>
              <p className="text-cream/80">Absolutely! There are no long-term contracts. Cancel anytime from your account settings.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 semi-translucent-button text-cream px-8 py-4 rounded-lg font-bold text-lg"
          >
            Start Building Free
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-panel-grey">© 2025 qlynk. Your presence, in a blink.</p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
