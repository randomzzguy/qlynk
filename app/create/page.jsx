'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, Plus, Trash2, Linkedin, Instagram, Twitter, Github, Facebook, Youtube, Sparkles, Briefcase, User, ShoppingBag, Palette } from 'lucide-react';
import { 
  ProfessionalTemplate, 
  CreativeTemplate, 
  MinimalistTemplate, 
  DarkTemplate, 
  VibrantTemplate,
  MonoPressTemplate,
  AuroraTemplate,
  BrutalistTemplate
} from '@/components/Templates';
import { createClient } from '@/utils/supabase/client';
// Background elements are now unified with the home page CSS (globals.css)

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
  { id: 'twitter', name: 'Twitter', icon: Twitter },
  { id: 'github', name: 'GitHub', icon: Github },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'youtube', name: 'YouTube', icon: Youtube },
];

const USE_CASES = [
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: Palette,
    desc: 'Showcase your work and projects',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    desc: 'Professional business presence',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: User,
    desc: 'Market your services',
    color: 'from-green to-emerald-500'
  },
  {
    id: 'product',
    name: 'Product/Brand',
    icon: ShoppingBag,
    desc: 'Launch or promote a product',
    color: 'from-orange-500 to-amber'
  }
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    tagline: '',
    bio: '',
    profileImage: '',
    email: '',
    phone: '',
    cta: '',
    ctaLink: '',
    socialLinks: [],
    links: []
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not logged in, redirect to signup
        router.push('/auth/signup');
        return;
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-bright-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-panel-grey font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const templates = {
    professional: { 
      name: 'Professional', 
      component: ProfessionalTemplate, 
      desc: 'Corporate & clean',
      color: 'from-blue-500 to-blue-600'
    },
    creative: { 
      name: 'Creative', 
      component: CreativeTemplate, 
      desc: 'Vibrant & asymmetric',
      color: 'from-purple-500 to-pink-500'
    },
    minimalist: { 
      name: 'Minimalist', 
      component: MinimalistTemplate, 
      desc: 'Simple & elegant',
      color: 'from-gray-500 to-gray-600'
    },
    dark: { 
      name: 'Dark', 
      component: DarkTemplate, 
      desc: 'Modern & sleek',
      color: 'from-gray-800 to-gray-900'
    },
    vibrant: { 
      name: 'Vibrant', 
      component: VibrantTemplate, 
      desc: 'Bold & energetic',
      color: 'from-violet-500 to-fuchsia-500'
    },
    monopress: {
      name: 'MonoPress',
      component: MonoPressTemplate,
      desc: 'Editorial serif & grid',
      color: 'from-neutral-200 to-neutral-400'
    },
    aurora: {
      name: 'Aurora',
      component: AuroraTemplate,
      desc: 'Pastel gradients & blur',
      color: 'from-violet-400 to-pink-400'
    },
    brutalist: {
      name: 'Brutalist',
      component: BrutalistTemplate,
      desc: 'Stark blocks & borders',
      color: 'from-black to-neutral-700'
    },
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSocialLink = (platform) => {
    const platformData = SOCIAL_PLATFORMS.find(p => p.id === platform);
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform, url: '', icon: platformData.icon }]
    }));
  };

  const updateSocialLink = (index, url) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => i === index ? { ...link, url } : link)
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const addCustomLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '', description: '' }]
    }));
  };

  const updateCustomLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? { ...link, [field]: value } : link)
    }));
  };

  const removeCustomLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Import the createPage function
      const { createPage } = await import('@/lib/supabase');
      
      // Save page to Supabase
      const { data, error } = await createPage({
        ...formData,
        theme: selectedTemplate,
        preferredUsername: typeof window !== 'undefined' ? (localStorage.getItem('qlynk_pending_username') || undefined) : undefined
      });

      if (error) {
        toast.error('Error creating page: ' + error.message);
        setIsPublishing(false);
        return;
      }

      // Success! Show message and redirect to dashboard
      toast.success('🎉 Page created successfully! Your page is live at qlynk.site/' + data.username);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('An error occurred while publishing your page. Please try again.');
      setIsPublishing(false);
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 0: return useCase;
      case 1: return selectedTemplate;
      case 2: return formData.name.trim() && formData.profession.trim();
      case 3: return formData.tagline.trim() && formData.bio.trim();
      case 4: return formData.cta.trim();
      case 5: return formData.email.trim();
      default: return true;
    }
  };

  // Get tailored labels based on use case
  const getLabels = () => {
    switch(useCase) {
      case 'portfolio':
        return {
          profession: 'Your Role/Specialty',
          professionPlaceholder: 'e.g. UX Designer, Photographer, Developer',
          tagline: 'Your Creative Motto',
          taglinePlaceholder: 'e.g. Crafting beautiful digital experiences',
          cta: 'Primary Call-to-Action',
          ctaPlaceholder: 'e.g. View My Work, Hire Me, See Portfolio'
        };
      case 'business':
        return {
          profession: 'Company/Position',
          professionPlaceholder: 'e.g. CEO at TechCorp, Marketing Agency',
          tagline: 'Business Tagline',
          taglinePlaceholder: 'e.g. Innovative solutions for modern businesses',
          cta: 'Main Action',
          ctaPlaceholder: 'e.g. Get a Quote, Contact Us, Learn More'
        };
      case 'freelance':
        return {
          profession: 'Your Services',
          professionPlaceholder: 'e.g. Freelance Writer, Web Developer',
          tagline: 'Your Value Proposition',
          taglinePlaceholder: 'e.g. Turning ideas into reality, one project at a time',
          cta: 'Book/Contact Action',
          ctaPlaceholder: 'e.g. Hire Me, Book Consultation, Get Started'
        };
      case 'product':
        return {
          profession: 'Product/Brand Name',
          professionPlaceholder: 'e.g. EcoBottle, SmartHome Pro',
          tagline: 'Product Slogan',
          taglinePlaceholder: 'e.g. Sustainable living made simple',
          cta: 'Product Action',
          ctaPlaceholder: 'e.g. Buy Now, Pre-Order, Learn More'
        };
      default:
        return {
          profession: 'Profession / Title',
          professionPlaceholder: 'e.g. UX Designer & Brand Strategist',
          tagline: 'Tagline / Motto',
          taglinePlaceholder: 'e.g. Design with intention. Build with purpose.',
          cta: 'Button Text',
          ctaPlaceholder: 'e.g. Book a Call, Hire Me, Get in Touch'
        };
    }
  };

  const labels = getLabels();
  const CurrentTemplate = templates[selectedTemplate].component;

const ThemeSelector = ({ selectedTheme, onThemeSelect, userIsPremium }) => {
    const themes = Object.entries(templates).map(([key, value]) => ({...value, key}));

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {themes.map((theme) => {
                const isSelected = selectedTheme === theme.key;
                return (
                    <div 
                        key={theme.key} 
                        className={`relative rounded-2xl overflow-hidden border-4 transition-all cursor-pointer ${
                            isSelected ? 'border-bright-orange scale-105' : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => onThemeSelect(theme.key)}
                    >
                        <div className={`w-full h-40 bg-gradient-to-br ${theme.color}`}></div>
                        <div className="p-4 bg-white">
                            <h3 className="font-black text-charcoal">{theme.name}</h3>
                            <p className="text-sm text-panel-grey">{theme.desc}</p>
                        </div>
                        {isSelected && (
                            <div className="absolute top-3 right-3 bg-bright-orange text-white rounded-full p-1.5">
                                <Check size={18} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};


  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">What are you building?</h2>
            <p className="text-cream/90 mb-10 text-lg">Choose the type that best fits your needs</p>
            <div className="grid md:grid-cols-2 gap-6">
              {USE_CASES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setUseCase(item.id); setStep(1); }}
                    className={`group relative p-8 rounded-2xl border-2 transition-all text-left overflow-hidden bg-white/85 hover:bg-white flex flex-col items-start justify-start min-h-[200px] ${
                      useCase === item.id
                        ? 'border-bright-orange bg-bright-orange/5 shadow-xl shadow-bright-orange/10 scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-bl-full transition-all group-hover:scale-150`}></div>
                    <Icon size={40} className={`mb-4 ${useCase === item.id ? 'text-bright-orange' : 'text-charcoal'}`} />
                    <h3 className="text-2xl font-black mb-2 relative z-10 text-charcoal whitespace-normal break-words text-balance">{item.name}</h3>
                    <p className="text-panel-grey relative z-10 whitespace-normal break-words text-pretty">{item.desc}</p>
                    {useCase === item.id && (
                      <div className="mt-4 flex items-center text-bright-orange font-bold relative z-10">
                        <Check size={20} className="mr-2" /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Choose Your Theme</h2>
            <p className="text-cream/90 mb-10 text-lg">Pick a style that matches your {useCase}</p>
            <ThemeSelector
              selectedTheme={selectedTemplate}
              onThemeSelect={setSelectedTemplate}
              userIsPremium={false} // Replace with actual user premium status
            />
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Basic Info</h2>
            <p className="text-cream/90 mb-10 text-lg">Tell us about your {useCase}</p>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">
                  {useCase === 'product' ? 'Your Name' : 'Your Name'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder={useCase === 'product' ? 'e.g. John Smith' : 'e.g. Sarah Mitchell'}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">{labels.profession} *</label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => updateFormData('profession', e.target.value)}
                  placeholder={labels.professionPlaceholder}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">
                  {useCase === 'product' ? 'Product Image URL' : 'Profile Image URL'} (optional)
                </label>
                <input
                  type="text"
                  value={formData.profileImage}
                  onChange={(e) => updateFormData('profileImage', e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
                <p className="text-sm text-panel-grey mt-2 ml-1">Paste a direct image URL</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">About {useCase === 'product' ? 'Your Product' : 'You'}</h2>
            <p className="text-cream/90 mb-10 text-lg">Share your story</p>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">{labels.tagline} *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateFormData('tagline', e.target.value)}
                  placeholder={labels.taglinePlaceholder}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
                <p className="text-sm text-panel-grey mt-2 ml-1">A short, memorable phrase</p>
              </div>
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">
                  {useCase === 'product' ? 'Product Description' : 'Bio'} *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  placeholder={
                    useCase === 'product' 
                      ? 'Describe your product, its features, and benefits...'
                      : useCase === 'business'
                      ? 'Tell visitors about your company, services, and what makes you unique...'
                      : 'Tell visitors about yourself, your experience, what you do...'
                  }
                  rows={5}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300 resize-none"
                />
                <p className="text-sm text-panel-grey mt-2 ml-1">2-3 sentences work best</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Call to Action</h2>
            <p className="text-cream/90 mb-10 text-lg">What do you want visitors to do?</p>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">{labels.cta} *</label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => updateFormData('cta', e.target.value)}
                  placeholder={labels.ctaPlaceholder}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">Button Link (optional)</label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => updateFormData('ctaLink', e.target.value)}
                  placeholder="https://calendly.com/yourname or #contact"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Contact Info</h2>
            <p className="text-cream/90 mb-10 text-lg">How can people reach you?</p>
            <div className="space-y-6">
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
              <div className="group">
                <label className="block font-bold text-charcoal mb-3 text-lg">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all text-lg group-hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Social Links</h2>
            <p className="text-cream/90 mb-10 text-lg">Connect your social profiles (optional)</p>
            
            <div className="space-y-4 mb-8">
              {formData.socialLinks.map((link, index) => {
                const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform);
                const Icon = platform.icon;
                return (
                  <div key={index} className="flex items-center gap-3 group animate-slideIn">
                    <div className="flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-xl min-w-[160px] group-hover:bg-gray-200 transition-colors">
                      <Icon size={22} className="text-charcoal" />
                      <span className="font-bold text-charcoal">{platform.name}</span>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, e.target.value)}
                      placeholder={`https://${platform.id}.com/yourprofile`}
                      className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all"
                    />
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                );
              })}
            </div>

            {formData.socialLinks.length < SOCIAL_PLATFORMS.length && (
              <div>
                <p className="font-bold text-charcoal mb-4 text-lg">Add a social link:</p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_PLATFORMS.filter(p => !formData.socialLinks.find(l => l.platform === p.id)).map(platform => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => addSocialLink(platform.id)}
                        className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-bright-orange hover:bg-bright-orange/5 transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <Icon size={20} />
                        <span className="font-semibold">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="animate-fadeIn">
            <h2 className="text-4xl font-black text-cream mb-3">Custom Links</h2>
            <p className="text-cream/90 mb-10 text-lg">
              {useCase === 'portfolio' ? 'Add links to your projects and work' :
               useCase === 'business' ? 'Add links to services, testimonials, etc.' :
               useCase === 'freelance' ? 'Add links to your services and rates' :
               useCase === 'product' ? 'Add links to product pages, demos, etc.' :
               'Add links to your work, portfolio, blog, etc.'}
            </p>
            
            <div className="space-y-4 mb-8">
              {formData.links.map((link, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-bright-orange/50 transition-all hover:shadow-lg animate-slideIn">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-black text-charcoal text-lg">Link #{index + 1}</h3>
                    <button
                      onClick={() => removeCustomLink(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all hover:scale-110"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                      placeholder={
                        useCase === 'portfolio' ? 'e.g. View Project' :
                        useCase === 'product' ? 'e.g. Buy Now' :
                        'e.g. View Portfolio'
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all"
                    />
                    <input
                      type="text"
                      value={link.description}
                      onChange={(e) => updateCustomLink(index, 'description', e.target.value)}
                      placeholder="Short description (optional)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-bright-orange focus:outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCustomLink}
              className="flex items-center gap-3 px-8 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-bright-orange hover:bg-bright-orange/5 transition-all text-charcoal font-bold text-lg hover:scale-105"
            >
              <Plus size={24} />
              Add Another Link
            </button>
          </div>
        );

      case 8:
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green to-green/80 rounded-full mb-6 animate-bounce-slow">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-5xl font-black text-green mb-4">🎉 You&apos;re All Set!</h2>
              <p className="text-panel-grey text-xl">Your qlynk page is ready. Review it on the right →</p>
            </div>
            
            <div className="bg-bright-orange/5 border-2 border-bright-orange/20 rounded-2xl p-8 mb-8 hover:shadow-xl transition-all">
              <h3 className="font-black text-charcoal mb-4 text-2xl flex items-center gap-2">
                <Sparkles className="text-bright-orange" size={24} />
                What&apos;s Next?
              </h3>
              <ul className="space-y-3 text-charcoal text-lg">
                <li className="flex items-start">
                  <span className="text-green mr-3 text-2xl">✓</span>
                  <span>Your page will be live at: <span className="font-mono bg-white px-3 py-1 rounded-lg font-bold border border-gray-200">qlynk.site/username</span></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green mr-3 text-2xl">✓</span>
                  <span>You can edit anytime from your dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green mr-3 text-2xl">✓</span>
                  <span>Share your link across all platforms</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all">
              <h3 className="font-black text-charcoal mb-4 text-2xl">Your Data Summary:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-charcoal">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold">Type:</span> {USE_CASES.find(u => u.id === useCase)?.name}
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold">Name:</span> {formData.name}
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold">Theme:</span> {templates[selectedTemplate].name}
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold">Social Links:</span> {formData.socialLinks.length}
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <span className="font-bold">Custom Links:</span> {formData.links.length}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = 9;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      

      {/* Header */}
      <div className="bg-white/85 border-b border-beige/30 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image width={125} height={50} src="/assets/logo.svg" alt="qlynk logo" priority />
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm font-bold text-charcoal">
                Step {step + 1} of {totalSteps}
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="md:hidden inline-flex items-center justify-center semi-translucent-button text-cream px-5 py-2 rounded-lg font-bold transition-all"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-5 w-full bg-beige/40 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-orange h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className={`${showPreview ? 'hidden md:block' : 'block'}`}>
            <div className="semi-translucent-card-strong rounded-3xl p-10">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-10 pt-8 border-t-2 border-gray-100">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-charcoal transition-all text-lg semi-translucent-button-secondary"
                  >
                    <ArrowLeft size={22} />
                    Back
                  </button>
                )}
                
                {step < totalSteps - 1 ? (
                  <button
                    onClick={() => isStepValid() && setStep(step + 1)}
                    disabled={!isStepValid()}
                    className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ml-auto text-lg ${
                      isStepValid()
                        ? 'semi-translucent-button text-cream hover:translate-x-1'
                        : 'bg-beige/40 text-charcoal/40 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ArrowRight size={22} />
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={`flex items-center gap-2 px-10 py-4 rounded-xl font-black transition-all ml-auto text-lg ${
                      isPublishing
                        ? 'semi-translucent-button text-cream opacity-75 cursor-wait'
                        : 'semi-translucent-button text-cream hover:scale-105'
                    }`}
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check size={22} />
                        Publish Page
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className={`${showPreview ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-28">
              <div className="semi-translucent-card rounded-3xl overflow-hidden">
                <div className="bg-charcoal px-5 py-4 flex items-center justify-between">
                  <p className="text-cream font-bold flex items-center gap-2">
                    <Sparkles size={16} />
                    Live Preview
                  </p>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 hover:scale-125 transition-transform"></div>
                    <div className="w-3 h-3 rounded-full bg-orange hover:scale-125 transition-transform"></div>
                    <div className="w-3 h-3 rounded-full bg-green hover:scale-125 transition-transform"></div>
                  </div>
                </div>
                <div className="h-[70vh] overflow-y-auto">
                  <CurrentTemplate data={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}