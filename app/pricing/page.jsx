'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Check, X, Zap, Crown } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Trial',
      description: '14 days to test everything',
      price: 'Free',
      period: 'for 14 days',
      cta: 'Start Free Trial',
      icon: Zap,
      color: 'from-orange-400 to-orange-600',
      features: [
        { name: 'Full Pro features', included: true },
        { name: 'Agent live for trial period', included: true },
        { name: 'Credit card required', included: false },
        { name: 'Auto-upgrade after trial', included: true },
      ],
      highlight: true,
    },
    {
      name: 'Creator',
      description: 'For content creators & professionals',
      price: billingCycle === 'monthly' ? '$9' : '$84',
      period: billingCycle === 'monthly' ? '/month' : '/year (Save 22%)',
      cta: 'Upgrade Now',
      icon: Crown,
      color: 'from-emerald-400 to-emerald-600',
      features: [
        { name: 'Agent live 24/7', included: true },
        { name: '2,000 messages/month', included: true },
        { name: 'Unlimited conversations', included: true },
        { name: 'Forms + 5 documents', included: true },
        { name: 'Custom colors & avatar', included: true },
        { name: 'Full analytics', included: true },
        { name: 'Email support', included: true },
      ],
    },
    {
      name: 'Agency',
      description: 'For agencies & businesses',
      price: billingCycle === 'monthly' ? '$19' : '$180',
      period: billingCycle === 'monthly' ? '/month' : '/year (Save 21%)',
      cta: 'Upgrade Now',
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
      features: [
        { name: 'Agent live 24/7', included: true },
        { name: '10,000 messages/month', included: true },
        { name: 'Unlimited conversations', included: true },
        { name: 'Forms + 25 documents', included: true },
        { name: 'Full white-label', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Up to 3 agents', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom domain', included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
      {/* Navigation */}
      <nav className="bg-stone-900/80 backdrop-blur-lg border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image width={140} height={40} src="/assets/logoWhite.svg" alt="qlynk logo" priority />
          </Link>
          <Link href="/auth/login" className="text-gray-300 hover:text-orange-500 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Animated orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start with a free 14-day trial. No credit card needed to explore. Upgrade anytime to go live.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex rounded-full bg-stone-800/50 backdrop-blur-sm border border-stone-700 p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Annual (Save 21%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                    plan.highlight
                      ? 'md:scale-105 border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-600/10'
                      : 'border border-stone-700 bg-stone-900/50 hover:border-stone-600'
                  }`}
                >
                  {/* Badge */}
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${plan.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="text-4xl font-black text-white">
                        {plan.price}
                        <span className="text-lg text-gray-400 font-normal">{plan.period}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href="/auth/signup"
                      className={`w-full block text-center py-3 rounded-lg font-bold transition-all mb-8 ${
                        plan.highlight
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/50'
                          : 'bg-stone-800 text-white hover:bg-stone-700'
                      }`}
                    >
                      {plan.cta}
                    </Link>

                    {/* Features */}
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-4 mb-20">
          <h2 className="text-3xl font-black text-white mb-12 text-center">Questions?</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do I need a credit card for the free trial?',
                a: 'Yes, a valid credit card is required. We won\'t charge you during the trial period. Your trial automatically upgrades to Creator plan after 14 days.',
              },
              {
                q: 'What happens when my trial expires?',
                a: 'Your agent goes offline and visitors see "temporarily unavailable." Your dashboard remains accessible so you can edit your agent. Upgrade anytime to go live.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription anytime. No questions asked, no hidden fees.',
              },
              {
                q: 'What if I exceed my message limit?',
                a: 'We\'ll notify you when you\'re approaching your limit. You can upgrade anytime to get more messages.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-stone-800/50 backdrop-blur-sm border border-stone-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center pb-20">
          <p className="text-gray-400 mb-6">Ready to build your Q-Agent?</p>
          <Link
            href="/auth/signup"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
