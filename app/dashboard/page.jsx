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
              <h1 className="text-4xl font-black text-white mb-2">
                Welcome back, {profile?.username || 'there'}! 👋
              </h1>
              <p className="text-xl text-gray-400">Manage your qlynk page</p>
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
                    <h2 className="text-2xl font-black text-white mb-2">Your Qlynk Page</h2>
                    <p className="text-panel-grey">
                      Live at:{' '}
                      <a
                        href={`/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bright-orange hover:underline font-semibold"
                      >
                        qlynk.site/{profile.username}
                      </a>
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${page.is_published
                    ? 'bg-green/10 text-green'
                    : 'bg-amber/10 text-amber'
                    }`}>
                    {page.is_published ? '✓ Published' : 'Draft'}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Link
                    href={`/${profile.username}`}
                    target="_blank"
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-bright-orange hover:bg-bright-orange/5 transition-all group"
                  >
                    <div className="w-12 h-12 bg-bright-orange/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Eye className="text-bright-orange" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">View Page</h3>
                      <p className="text-sm text-gray-400">See your live page</p>
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
                      <h3 className="font-bold text-white">Edit Page</h3>
                      <p className="text-sm text-gray-400">Update your content</p>
                    </div>
                  </Link>

                  <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-green hover:bg-green/5 transition-all group">
                    <div className="w-12 h-12 bg-green/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="text-green" size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white">Analytics</h3>
                      <p className="text-sm text-gray-400">{page.page_views || 0} views</p>
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
              <div className="bg-card/80 rounded-2xl shadow-lg border-2 border-border p-8">
                <h3 className="text-2xl font-black text-white mb-6">Page Preview</h3>
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                  {/* Mock Browser Bar */}
                  <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 mx-4 bg-gray-900 rounded px-3 py-1 text-xs text-gray-400 font-mono text-center">
                      qlynk.site/{profile.username}
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-8 text-center min-h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                    <div className="relative z-10 w-full max-w-md">
                      {page.profile_image ? (
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-bright-orange blur-xl opacity-20 rounded-full"></div>
                          <img
                            src={page.profile_image}
                            alt={page.name}
                            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-800 shadow-2xl relative z-10"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-bright-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl border-4 border-gray-800">
                          👤
                        </div>
                      )}

                      <h4 className="text-3xl font-black text-white mb-2">{page.name || "Your Name"}</h4>
                      <p className="text-lg text-bright-orange font-bold mb-4">{page.profession || "Your Profession"}</p>

                      {page.tagline && (
                        <p className="text-gray-400 italic mb-8 border-l-2 border-gray-700 pl-4 bg-gray-800/30 py-2 rounded-r-lg inline-block">
                          &ldquo;{page.tagline}&rdquo;
                        </p>
                      )}

                      <div className="flex gap-3 justify-center">
                        {(page.social_links || ['twitter', 'linkedin']).slice(0, 3).map((link, i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                          </div>
                        ))}
                      </div>
                    </div>
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