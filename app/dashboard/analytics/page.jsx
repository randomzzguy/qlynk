'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getCurrentUser } from '@/lib/supabase';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2,
  MessageCircle,
  Bot,
  Clock,
  ChevronRight,
  User,
  Loader2
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [agentStats, setAgentStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    avgMessagesPerConvo: 0,
    todayConversations: 0
  });

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUserId(user.id);

      const supabase = createClient();

      // Load conversations
      const { data: convos } = await supabase
        .from('agent_conversations')
        .select('*')
        .eq('agent_owner_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);

      if (convos) {
        setConversations(convos);
        
        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayConvos = convos.filter(c => new Date(c.started_at) >= today);
        const totalMessages = convos.reduce((sum, c) => sum + (c.message_count || 0), 0);
        
        setAgentStats({
          totalConversations: convos.length,
          totalMessages,
          avgMessagesPerConvo: convos.length > 0 ? (totalMessages / convos.length).toFixed(1) : 0,
          todayConversations: todayConvos.length
        });
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const loadConversationMessages = async (conversationId) => {
    setLoadingMessages(true);
    setSelectedConversation(conversationId);
    
    const supabase = createClient();
    const { data: messages } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (messages) {
      setConversationMessages(messages);
    }
    setLoadingMessages(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const pageStats = [
    { label: 'Total Views', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Unique Visitors', value: '856', change: '+8%', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Clicks', value: '342', change: '+24%', icon: MousePointer2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Engagement Rate', value: '28%', change: '+2%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-8">Analytics Overview</h1>

          {/* Page Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {pageStats.map((stat, index) => (
              <div key={index} className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Q-Agent Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Bot className="text-bright-orange" size={24} />
              Q-Agent Analytics
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-bright-orange/10">
                    <MessageCircle className="text-bright-orange" size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-1">{agentStats.totalConversations}</h3>
                <p className="text-gray-400 font-medium">Total Conversations</p>
              </div>

              <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-cyan-blue/10">
                    <BarChart3 className="text-cyan-blue" size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-1">{agentStats.totalMessages}</h3>
                <p className="text-gray-400 font-medium">Total Messages</p>
              </div>

              <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green/10">
                    <TrendingUp className="text-green" size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-1">{agentStats.avgMessagesPerConvo}</h3>
                <p className="text-gray-400 font-medium">Avg Messages/Convo</p>
              </div>

              <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Clock className="text-purple-500" size={24} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-1">{agentStats.todayConversations}</h3>
                <p className="text-gray-400 font-medium">Today&apos;s Conversations</p>
              </div>
            </div>
          </div>

          {/* Conversations and Transcript View */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Conversations List */}
            <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Recent Conversations</h3>
              
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No conversations yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Conversations will appear here when visitors chat with your agent
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {conversations.map((convo) => (
                    <button
                      key={convo.id}
                      onClick={() => loadConversationMessages(convo.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors text-left ${
                        selectedConversation === convo.id
                          ? 'bg-bright-orange/10 border border-bright-orange/30'
                          : 'bg-background hover:bg-background/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            Visitor {convo.visitor_id?.slice(0, 8) || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {convo.message_count || 0} messages • {formatDate(convo.started_at)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conversation Transcript */}
            <div className="bg-card/80 rounded-2xl p-6 shadow-sm border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Conversation Transcript</h3>
              
              {!selectedConversation ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a conversation to view</p>
                </div>
              ) : loadingMessages ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-bright-orange animate-spin mx-auto" />
                </div>
              ) : conversationMessages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No messages in this conversation</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {conversationMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-gray-600' : 'bg-bright-orange/20'
                      }`}>
                        {msg.role === 'user' ? (
                          <User size={14} className="text-gray-300" />
                        ) : (
                          <Bot size={14} className="text-bright-orange" />
                        )}
                      </div>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-gray-700 rounded-tr-sm' 
                          : 'bg-background rounded-tl-sm'
                      }`}>
                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Page Traffic Charts */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Traffic Overview</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-full bg-blue-500/10 rounded-t-lg relative group">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-400 font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-card/80 rounded-2xl p-8 shadow-sm border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Top Locations</h3>
              <div className="space-y-4">
                {[
                  { country: 'United States', percentage: 45 },
                  { country: 'United Kingdom', percentage: 20 },
                  { country: 'Canada', percentage: 15 },
                  { country: 'Germany', percentage: 10 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-white">{item.country}</span>
                      <span className="text-gray-400">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
