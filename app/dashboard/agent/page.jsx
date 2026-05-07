'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getCurrentUser } from '@/lib/supabase';
import { 
  Bot, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  FileText,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AgentConfigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  
  // Agent config state
  const [config, setConfig] = useState({
    agent_name: 'Q-Agent',
    agent_avatar: '',
    welcome_message: 'Hi! I\'m the AI assistant for this page. How can I help you?',
    bio: '',
    skills: [],
    projects: [],
    contact_info: {
      email: '',
      phone: '',
      location: '',
      website: '',
      calendly: ''
    },
    social_links: [],
    custom_knowledge: '',
    primary_color: '#f46530',
    position: 'bottom-right',
    is_enabled: true
  });

  // Form input states for arrays
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', url: '' });
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }
        setUserId(user.id);

        const supabase = createClient();
        
        // Get username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }

        // Get existing agent config
        const { data: existingConfig } = await supabase
          .from('agent_configs')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingConfig) {
          setConfig({
            ...config,
            ...existingConfig,
            skills: existingConfig.skills || [],
            projects: existingConfig.projects || [],
            contact_info: existingConfig.contact_info || {},
            social_links: existingConfig.social_links || [],
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading config:', error);
        setLoading(false);
      }
    };

    loadConfig();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    setSaveStatus(null);

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('agent_configs')
        .upsert({
          user_id: userId,
          ...config,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateContactInfo = (field, value) => {
    setConfig(prev => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value }
    }));
  };

  // Skills management
  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setConfig(prev => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill }]
    }));
    setNewSkill({ name: '', level: '' });
  };

  const removeSkill = (index) => {
    setConfig(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Projects management
  const addProject = () => {
    if (!newProject.name.trim()) return;
    setConfig(prev => ({
      ...prev,
      projects: [...prev.projects, { ...newProject }]
    }));
    setNewProject({ name: '', description: '', url: '' });
  };

  const removeProject = (index) => {
    setConfig(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Social links management
  const addSocialLink = () => {
    if (!newSocialLink.platform.trim() || !newSocialLink.url.trim()) return;
    setConfig(prev => ({
      ...prev,
      social_links: [...prev.social_links, { ...newSocialLink }]
    }));
    setNewSocialLink({ platform: '', url: '' });
  };

  const removeSocialLink = (index) => {
    setConfig(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading agent configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-bright-orange/10 rounded-xl flex items-center justify-center">
                  <Bot className="text-bright-orange" size={24} />
                </div>
                <h1 className="text-4xl font-black text-white">Q-Agent</h1>
              </div>
              <p className="text-xl text-gray-400">Configure your AI assistant</p>
            </div>
            
            <div className="flex items-center gap-3">
              {username && (
                <a 
                  href={`/${username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 border border-border rounded-lg text-gray-400 hover:text-white hover:border-bright-orange transition-colors"
                >
                  <Eye size={18} />
                  Preview
                </a>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-bright-orange text-white rounded-lg font-semibold hover:bg-bright-orange/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saveStatus === 'success' ? (
                  <CheckCircle size={18} />
                ) : saveStatus === 'error' ? (
                  <AlertCircle size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Enable/Disable Toggle */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {config.is_enabled ? (
                  <Eye className="text-green" size={24} />
                ) : (
                  <EyeOff className="text-gray-500" size={24} />
                )}
                <div>
                  <h3 className="font-bold text-white">Agent Status</h3>
                  <p className="text-sm text-gray-400">
                    {config.is_enabled ? 'Your Q-Agent is live and visible to visitors' : 'Your Q-Agent is hidden from visitors'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateConfig('is_enabled', !config.is_enabled)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  config.is_enabled ? 'bg-green' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  config.is_enabled ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Agent Branding */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bot size={20} />
              Agent Branding
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={config.agent_name}
                  onChange={(e) => updateConfig('agent_name', e.target.value)}
                  placeholder="Q-Agent"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Primary Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => updateConfig('primary_color', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primary_color}
                    onChange={(e) => updateConfig('primary_color', e.target.value)}
                    className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Avatar URL (optional)</label>
                <input
                  type="url"
                  value={config.agent_avatar}
                  onChange={(e) => updateConfig('agent_avatar', e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Widget Position</label>
                <select
                  value={config.position}
                  onChange={(e) => updateConfig('position', e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-bright-orange"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Welcome Message</label>
                <textarea
                  value={config.welcome_message}
                  onChange={(e) => updateConfig('welcome_message', e.target.value)}
                  placeholder="Hi! I'm the AI assistant for this page. How can I help you?"
                  rows={2}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange resize-none"
                />
              </div>
            </div>
          </div>

          {/* Bio & About */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} />
              About You
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
              <textarea
                value={config.bio}
                onChange={(e) => updateConfig('bio', e.target.value)}
                placeholder="Tell visitors about yourself, your background, and what you do..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange resize-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase size={20} />
              Skills & Expertise
            </h2>
            
            {/* Existing skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {config.skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-bright-orange/10 text-bright-orange rounded-full text-sm"
                >
                  <span>{skill.name}{skill.level && ` (${skill.level})`}</span>
                  <button 
                    onClick={() => removeSkill(index)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add new skill */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Skill name (e.g., React, Python)"
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
              />
              <input
                type="text"
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                placeholder="Level (optional)"
                className="w-32 px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2.5 bg-bright-orange/10 text-bright-orange rounded-lg hover:bg-bright-orange/20 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={20} />
              Projects & Work
            </h2>
            
            {/* Existing projects */}
            <div className="space-y-3 mb-4">
              {config.projects.map((project, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                >
                  <div>
                    <h4 className="font-semibold text-white">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-gray-400">{project.description}</p>
                    )}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-bright-orange hover:underline">
                        {project.url}
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => removeProject(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add new project */}
            <div className="space-y-3 p-4 bg-background rounded-lg border border-dashed border-border">
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Project name"
                className="w-full px-4 py-2.5 bg-card/80 border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
              />
              <input
                type="text"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Short description"
                className="w-full px-4 py-2.5 bg-card/80 border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
              />
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newProject.url}
                  onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Project URL (optional)"
                  className="flex-1 px-4 py-2.5 bg-card/80 border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
                />
                <button
                  onClick={addProject}
                  className="px-4 py-2.5 bg-bright-orange/10 text-bright-orange rounded-lg hover:bg-bright-orange/20 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Mail size={20} />
              Contact Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </label>
                <input
                  type="email"
                  value={config.contact_info.email || ''}
                  onChange={(e) => updateContactInfo('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Phone size={14} />
                  Phone
                </label>
                <input
                  type="tel"
                  value={config.contact_info.phone || ''}
                  onChange={(e) => updateContactInfo('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin size={14} />
                  Location
                </label>
                <input
                  type="text"
                  value={config.contact_info.location || ''}
                  onChange={(e) => updateContactInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Globe size={14} />
                  Website
                </label>
                <input
                  type="url"
                  value={config.contact_info.website || ''}
                  onChange={(e) => updateContactInfo('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Calendar size={14} />
                  Booking Link (Calendly, Cal.com, etc.)
                </label>
                <input
                  type="url"
                  value={config.contact_info.calendly || ''}
                  onChange={(e) => updateContactInfo('calendly', e.target.value)}
                  placeholder="https://calendly.com/yourname"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe size={20} />
              Social Links
            </h2>
            
            {/* Existing social links */}
            <div className="space-y-2 mb-4">
              {config.social_links.map((link, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white capitalize">{link.platform}</span>
                    <span className="text-xs text-gray-400">{link.url}</span>
                  </div>
                  <button 
                    onClick={() => removeSocialLink(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add new social link */}
            <div className="flex gap-3">
              <select
                value={newSocialLink.platform}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                className="w-40 px-4 py-2.5 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-bright-orange text-sm"
              >
                <option value="">Platform</option>
                <option value="twitter">Twitter/X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="dribbble">Dribbble</option>
                <option value="behance">Behance</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Profile URL"
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange text-sm"
              />
              <button
                onClick={addSocialLink}
                className="px-4 py-2.5 bg-bright-orange/10 text-bright-orange rounded-lg hover:bg-bright-orange/20 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Custom Knowledge */}
          <div className="bg-card/80 rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={20} />
              Custom Knowledge
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Add any additional information you want your agent to know. This could include FAQs, 
              detailed service descriptions, pricing info, or anything else visitors might ask about.
            </p>
            <textarea
              value={config.custom_knowledge}
              onChange={(e) => updateConfig('custom_knowledge', e.target.value)}
              placeholder="Enter any additional information for your agent..."
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bright-orange resize-none"
            />
          </div>

          {/* Document Upload Section - Link to dedicated page */}
          <div className="bg-card/80 rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload size={20} />
              Documents
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Upload PDFs, text files, or documents to expand your agent&apos;s knowledge base.
            </p>
            <a
              href="/dashboard/agent/documents"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-bright-orange/10 text-bright-orange rounded-lg hover:bg-bright-orange/20 transition-colors font-medium"
            >
              <Upload size={18} />
              Manage Documents
            </a>
          </div>
        </div>
      </div>
  );
}
