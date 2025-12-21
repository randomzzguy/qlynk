'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getCurrentProfile, getUserPage, signOut, getCurrentUser } from '@/lib/supabase';
import { Edit, Eye, BarChart3, LogOut, Plus, ExternalLink } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardSearch from '@/components/DashboardSearch';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check auth session first
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Then load profile; if missing, send user to create flow
        const userProfile = await getCurrentProfile();
        if (!userProfile) {
          router.push('/create');
          return;
        }

        setProfile(userProfile);

        // Try to load user's page
        const { data: userPage } = await getUserPage();
        setPage(userPage);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Check auth session first
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Then load profile; if missing, send user to create flow
      const userProfile = await getCurrentProfile();
      if (!userProfile) {
        router.push('/create');
        return;
      }

      setProfile(userProfile);

      // Try to load user's page
      const { data: userPage } = await getUserPage();
      setPage(userPage);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar onSignOut={handleSignOut} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-charcoal mb-2">
                Welcome back, {profile?.username || 'there'}! 👋
              </h1>
              <p className="text-xl text-panel-grey">Manage your qlynk page</p>
            </div>
            <DashboardSearch />
          </div>

          {page ? (
            /* User has a page */
            <div className="space-y-6">
              {/* Page Card */}
                <div className="bg-card/80 rounded-2xl shadow-lg border-2 border-border p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-charcoal mb-2">Your Qlynk Page</h2>
                    <p className="text-panel-grey">
                      Live at:{' '}
                      <a 
                        href={`/${page.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bright-orange hover:underline font-semibold"
                      >
                        qlynk.site/{page.username}
                      </a>
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${
                    page.is_published 
                      ? 'bg-green/10 text-green' 
                      : 'bg-amber/10 text-amber'
                  }`}>
                    {page.is_published ? '✓ Published' : 'Draft'}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    href={`/${page.username}`}
                    target="_blank"
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-bright-orange hover:bg-bright-orange/5 transition-all group"
                  >
                    <div className="w-12 h-12 bg-bright-orange/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Eye className="text-bright-orange" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">View Page</h3>
                      <p className="text-sm text-panel-grey">See your live page</p>
                    </div>
                  </Link>

                  <Link
                    href="/create"
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-blue hover:bg-cyan-blue/5 transition-all group"
                  >
                    <div className="w-12 h-12 bg-cyan-blue/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Edit className="text-cyan-blue" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal">Edit Page</h3>
                      <p className="text-sm text-panel-grey">Update your content</p>
                    </div>
                  </Link>

                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green hover:bg-green/5 transition-all group">
                    <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="text-green" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-charcoal">Analytics</h3>
                      <p className="text-sm text-panel-grey">{page.page_views || 0} views</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card/80 rounded-xl shadow-md border border-border p-6">
                  <div className="text-4xl font-black text-bright-orange mb-2">
                    {page.page_views || 0}
                  </div>
                  <div className="text-muted-foreground font-semibold">Total Page Views</div>
                </div>

                <div className="bg-card/80 rounded-xl shadow-md border border-border p-6">
                  <div className="text-4xl font-black text-cyan-blue mb-2">
                    {page.social_links?.length || 0}
                  </div>
                  <div className="text-muted-foreground font-semibold">Social Links</div>
                </div>

                <div className="bg-card/80 rounded-xl shadow-md border border-border p-6">
                  <div className="text-4xl font-black text-green mb-2">
                    {page.custom_links?.length || 0}
                  </div>
                  <div className="text-muted-foreground font-semibold">Custom Links</div>
                </div>
              </div>

              {/* Page Preview */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
                <h3 className="text-2xl font-black text-charcoal mb-6">Page Preview</h3>
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <div className="max-w-md mx-auto">
                    {page.profile_image && (
                      <img 
                        src={page.profile_image} 
                        alt={page.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                      />
                    )}
                    <h4 className="text-2xl font-black text-charcoal mb-1">{page.name}</h4>
                    <p className="text-lg text-panel-grey mb-2">{page.profession}</p>
                    <p className="text-panel-grey italic">&ldquo;{page.tagline}&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* User doesn't have a page yet */
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-bright-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="text-bright-orange" size={40} />
                </div>
                <h2 className="text-3xl font-black text-charcoal mb-4">
                  Create Your First Page
                </h2>
                <p className="text-xl text-panel-grey mb-8">
                  You haven&apos;t created a qlynk page yet. Let&apos;s get started!
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-bright-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-bright-orange/90 transition-all hover:shadow-lg hover:shadow-bright-orange/30"
                >
                  <Plus size={20} />
                  Create Your Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}