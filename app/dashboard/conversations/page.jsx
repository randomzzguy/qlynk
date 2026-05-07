'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import DashboardSidebar from '@/components/DashboardSidebar';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  ChevronRight,
  ChevronDown,
  Bot,
  User,
  Calendar,
  Filter
} from 'lucide-react';

export default function ConversationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const supabase = createClient();
        
        const { data } = await supabase
          .from('agent_conversations')
          .select('*')
          .eq('agent_owner_id', user.id)
          .order('started_at', { ascending: false });

        setConversations(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setLoading(false);
      }
    };

    loadConversations();
  }, [router]);

  const loadMessages = async (conversationId) => {
    if (selectedConvo === conversationId) {
      setSelectedConvo(null);
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    setSelectedConvo(conversationId);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getFilteredConversations = () => {
    if (filter === 'all') return conversations;

    const now = new Date();
    const filterDate = new Date();

    if (filter === 'today') {
      filterDate.setHours(0, 0, 0, 0);
    } else if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }

    return conversations.filter(c => new Date(c.started_at) >= filterDate);
  };

  const filteredConversations = getFilteredConversations();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar onSignOut={handleSignOut} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Conversations</h1>
              <p className="text-gray-400">View chat history between visitors and your Q-Agent</p>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-card/80 border border-border rounded-lg text-white focus:outline-none focus:border-bright-orange"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card/80 rounded-xl border border-border p-4">
              <div className="text-2xl font-black text-white">{conversations.length}</div>
              <div className="text-sm text-gray-400">Total Conversations</div>
            </div>
            <div className="bg-card/80 rounded-xl border border-border p-4">
              <div className="text-2xl font-black text-white">
                {conversations.reduce((sum, c) => sum + (c.message_count || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>
            <div className="bg-card/80 rounded-xl border border-border p-4">
              <div className="text-2xl font-black text-white">{filteredConversations.length}</div>
              <div className="text-sm text-gray-400">Showing</div>
            </div>
          </div>

          {/* Conversations List */}
          {filteredConversations.length > 0 ? (
            <div className="space-y-3">
              {filteredConversations.map((convo) => (
                <div key={convo.id} className="bg-card/80 rounded-xl border border-border overflow-hidden">
                  {/* Conversation Header */}
                  <button
                    onClick={() => loadMessages(convo.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-semibold">
                          Visitor {convo.visitor_id ? `#${convo.visitor_id.slice(0, 8)}` : ''}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {convo.message_count || 0} messages
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(convo.started_at).toLocaleDateString()}
                          </span>
                          {convo.visitor_location && (
                            <span>{convo.visitor_location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {convo.sentiment && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          convo.sentiment === 'positive' ? 'bg-green/10 text-green' :
                          convo.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {convo.sentiment}
                        </span>
                      )}
                      {selectedConvo === convo.id ? (
                        <ChevronDown className="text-gray-400" size={20} />
                      ) : (
                        <ChevronRight className="text-gray-400" size={20} />
                      )}
                    </div>
                  </button>

                  {/* Messages Panel */}
                  {selectedConvo === convo.id && (
                    <div className="border-t border-border bg-background/50 p-5">
                      {loadingMessages ? (
                        <div className="text-center py-8">
                          <div className="w-8 h-8 border-3 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                      ) : messages.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {messages.map((msg) => (
                            <div 
                              key={msg.id}
                              className={`flex items-start gap-3 ${
                                msg.role === 'assistant' ? '' : 'flex-row-reverse'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                msg.role === 'assistant' 
                                  ? 'bg-bright-orange/10' 
                                  : 'bg-gray-700'
                              }`}>
                                {msg.role === 'assistant' ? (
                                  <Bot size={16} className="text-bright-orange" />
                                ) : (
                                  <User size={16} className="text-gray-400" />
                                )}
                              </div>
                              <div className={`max-w-[80%] p-3 rounded-xl ${
                                msg.role === 'assistant'
                                  ? 'bg-card/80 border border-border'
                                  : 'bg-bright-orange/10 border border-bright-orange/20'
                              }`}>
                                <p className="text-white text-sm">{msg.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-400 py-8">No messages in this conversation</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card/80 rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-gray-500" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Conversations Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Once visitors start chatting with your Q-Agent, their conversations will appear here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
