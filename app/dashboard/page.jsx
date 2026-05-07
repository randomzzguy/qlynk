'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentProfile, signOut, getCurrentUser } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Eye, 
  EyeOff,
  Settings,
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import UpgradePrompt from '@/components/UpgradePrompt';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [agentConfig, setAgentConfig] = useState(null);
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    messagesThisWeek: 0,
    avgMessagesPerConvo: 0
  });
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const userProfile = await getCurrentProfile();
        if (!userProfile) {
          router.push('/onboarding');
          return;
        }

        if (!userProfile.onboarding_completed) {
          router.push('/onboarding');
          return;
        }

        setProfile(userProfile);

        const supabase = createClient();

        // Load agent config
        const { data: config } = await supabase
          .from('agent_configs')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setAgentConfig(config);

        // Load conversation stats
        const { data: conversations } = await supabase
          .from('agent_conversations')
          .select('id, message_count, started_at')
          .eq('agent_owner_id', user.id)
          .order('started_at', { ascending: false });

        if (conversations) {
          const totalConvos = conversations.length;
          const totalMsgs = conversations.reduce((sum, c) => sum + (c.message_count || 0), 0);
          
          // Messages this week
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          const recentConvos = conversations.filter(c => new Date(c.started_at) > weekAgo);
          const msgsThisWeek = recentConvos.reduce((sum, c) => sum + (c.message_count || 0), 0);

          setStats({
            totalConversations: totalConvos,
            totalMessages: totalMsgs,
            messagesThisWeek: msgsThisWeek,
            avgMessagesPerConvo: totalConvos > 0 ? Math.round(totalMsgs / totalConvos) : 0
          });

          setRecentConversations(conversations.slice(0, 5));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const toggleAgentStatus = async () => {
    if (!agentConfig) return;
    
    const supabase = createClient();
    const newStatus = !agentConfig.is_enabled;
    
    const { error } = await supabase
      .from('agent_configs')
      .update({ is_enabled: newStatus })
      .eq('user_id', profile.id);
    
    if (!error) {
      setAgentConfig(prev => ({ ...prev, is_enabled: newStatus }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <UpgradePrompt />

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                Welcome back, {profile?.username || 'there'}
              </h1>
              <p className="text-lg text-gray-400">Here&apos;s how your Q-Agent is performing</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link 
                href={`/${profile?.username}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-card/80 border border-border rounded-lg text-gray-400 hover:text-white hover:border-bright-orange transition-colors"
              >
                <ExternalLink size={18} />
                View Live Page
              </Link>
              <Link 
                href="/dashboard/agent"
                className="flex items-center gap-2 px-4 py-2.5 bg-bright-orange text-white rounded-lg font-semibold hover:bg-bright-orange/90 transition-colors"
              >
                <Settings size={18} />
                Configure Agent
              </Link>
            </div>
          </div>

          {/* Agent Status Card */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  agentConfig?.is_enabled ? 'bg-green/10' : 'bg-gray-500/10'
                }`}>
                  <Bot className={agentConfig?.is_enabled ? 'text-green' : 'text-gray-500'} size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {agentConfig?.agent_name || 'Q-Agent'}
                  </h2>
                  <p className="text-gray-400">
                    {agentConfig?.is_enabled 
                      ? 'Your agent is live and ready to chat with visitors' 
                      : 'Your agent is currently offline'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  agentConfig?.is_enabled 
                    ? 'bg-green/10 text-green' 
                    : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {agentConfig?.is_enabled ? (
                    <>
                      <Eye size={16} />
                      Live
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} />
                      Offline
                    </>
                  )}
                </div>
                
                <button
                  onClick={toggleAgentStatus}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    agentConfig?.is_enabled ? 'bg-green' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    agentConfig?.is_enabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card/80 rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-bright-orange/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-bright-orange" size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stats.totalMessages}</div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>

            <div className="bg-card/80 rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-blue/10 rounded-lg flex items-center justify-center">
                  <Users className="text-cyan-blue" size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stats.totalConversations}</div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>

            <div className="bg-card/80 rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green" size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stats.messagesThisWeek}</div>
              <div className="text-sm text-gray-400">Messages This Week</div>
            </div>

            <div className="bg-card/80 rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="text-purple-500" size={20} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stats.avgMessagesPerConvo}</div>
              <div className="text-sm text-gray-400">Avg per Conversation</div>
            </div>
          </div>

          {/* Recent Conversations & Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Conversations */}
            <div className="lg:col-span-2 bg-card/80 rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Recent Conversations</h3>
                <Link 
                  href="/dashboard/conversations"
                  className="text-sm text-bright-orange hover:underline"
                >
                  View All
                </Link>
              </div>
              
              {recentConversations.length > 0 ? (
                <div className="space-y-3">
                  {recentConversations.map((convo) => (
                    <div 
                      key={convo.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-bright-orange/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Users size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Visitor</p>
                          <p className="text-sm text-gray-400">
                            {convo.message_count || 0} messages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        {new Date(convo.started_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-gray-500" size={28} />
                  </div>
                  <p className="text-gray-400 mb-2">No conversations yet</p>
                  <p className="text-sm text-gray-500">
                    Share your page link to start getting visitors
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card/80 rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/dashboard/agent"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-bright-orange transition-colors group"
                >
                  <div className="w-10 h-10 bg-bright-orange/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="text-bright-orange" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Edit Agent</p>
                    <p className="text-xs text-gray-400">Customize responses</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/agent/documents"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-cyan-blue transition-colors group"
                >
                  <div className="w-10 h-10 bg-cyan-blue/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="text-cyan-blue" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Knowledge Base</p>
                    <p className="text-xs text-gray-400">Upload documents</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-green transition-colors group"
                >
                  <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-green" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">View Analytics</p>
                    <p className="text-xs text-gray-400">Track performance</p>
                  </div>
                </Link>

                <a
                  href={`/${profile?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-purple-500 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ExternalLink className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Preview Page</p>
                    <p className="text-xs text-gray-400">See live agent</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
