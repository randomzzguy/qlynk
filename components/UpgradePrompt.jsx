'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, Zap, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { getTrialDaysRemaining, isTrialExpired } from '@/lib/subscriptionHelpers';

export default function UpgradePrompt() {
  const [subscription, setSubscription] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setSubscription(sub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading || dismissed || !subscription) {
    return null;
  }

  // Show trial expiring soon
  if (subscription.tier === 'trial' && !isTrialExpired(subscription.trial_ends_at)) {
    const daysLeft = getTrialDaysRemaining(subscription.trial_ends_at);
    if (daysLeft <= 3) {
      return (
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-lg p-4 flex items-start gap-4 mb-6">
          <Clock className="text-amber-500 flex-shrink-0 mt-1" size={20} />
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">Trial Ending Soon</h3>
            <p className="text-amber-100 text-sm mb-3">
              You have {daysLeft} day{daysLeft !== 1 ? 's' : ''} left on your free trial. Upgrade now to keep your agent live!
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
            >
              View Plans
            </Link>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-300 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      );
    }
  }

  // Show trial expired
  if (subscription.tier === 'trial' && isTrialExpired(subscription.trial_ends_at)) {
    return (
      <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-4 mb-6">
        <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">Trial Expired</h3>
          <p className="text-red-100 text-sm mb-3">
            Your Q-Agent is offline. Upgrade to a paid plan to go live again.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-red-400 hover:text-red-300 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  // Show upsell for free tier
  if (subscription.tier === 'pro' && subscription.status === 'active') {
    return (
      <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 rounded-lg p-4 flex items-start gap-4 mb-6">
        <Zap className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">Ready to Scale?</h3>
          <p className="text-emerald-100 text-sm mb-3">
            Upgrade to Agency plan for 10,000 messages/month, white-label options, and more agents.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
          >
            See Plans
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-emerald-400 hover:text-emerald-300 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return null;
}
