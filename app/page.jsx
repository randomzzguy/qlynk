'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Palette, Shield, BarChart3, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const words = ['Professionals', 'Creators', 'Freelancers', 'Products', 'Businesses', 'Everyone'];

  useEffect(() => {
    // Create particle system
    const createParticles = () => {
      const particlesContainer = document.getElementById('particles');
      if (!particlesContainer) return;
      
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 30 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  useEffect(() => {
    const TYPE_SPEED = 90;
    const DELETE_SPEED = 45;
    const PAUSE_BEFORE_DELETE = 1200;
    const PAUSE_BEFORE_TYPE = 300;

    const i = loopNum % words.length;
    const fullText = words[i];

    if (!isDeleting && text === fullText) {
      const timer = setTimeout(() => setIsDeleting(true), PAUSE_BEFORE_DELETE);
      return () => clearTimeout(timer);
    }

    if (isDeleting && text === '') {
      const timer = setTimeout(() => {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }, PAUSE_BEFORE_TYPE);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );
    }, isDeleting ? DELETE_SPEED : TYPE_SPEED);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2a2e30] overflow-hidden relative">
      {/* Enhanced Professional Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Particle System */}
        <div className="particles-container" id="particles"></div>
        
        {/* Data Streams */}
        <div className="data-stream" style={{ top: '-120px', left: '10%', animationDelay: '0s' }} />
        <div className="data-stream" style={{ top: '-120px', left: '30%', animationDelay: '-1s' }} />
        <div className="data-stream" style={{ top: '-120px', left: '50%', animationDelay: '-2s' }} />
        <div className="data-stream" style={{ top: '-120px', left: '70%', animationDelay: '-3s' }} />
        <div className="data-stream" style={{ top: '-120px', left: '90%', animationDelay: '-1.5s' }} />
        
        {/* Radial gradients */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(244, 101, 48, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(42, 157, 143, 0.08) 0%, transparent 50%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 249, 250, 0.8) 100%)
            `
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.8
          }}
        />

        {/* Paper texture */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
            opacity: 0.9
          }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-20 left-10 w-16 h-16 bg-orange-500/10 rounded-lg transform rotate-45"
            style={{ animation: 'float 6s ease-in-out infinite' }}
          />
          <div 
            className="absolute top-1/3 right-20 w-12 h-12 bg-teal-500/10 rounded-full"
            style={{ animation: 'float 8s ease-in-out infinite reverse' }}
          />
          <div 
            className="absolute bottom-32 left-1/4 w-20 h-20 bg-orange-500/5 border-2 border-orange-500/20 rounded-lg transform -rotate-12"
            style={{ animation: 'float 10s ease-in-out infinite' }}
          />
          <div 
            className="absolute bottom-20 right-1/3 w-8 h-24 bg-teal-500/10 rounded-full transform rotate-45"
            style={{ animation: 'float 7s ease-in-out infinite reverse' }}
          />
          
          {/* Neural network nodes */}
          <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-orange-500/30 rounded-full" style={{ animation: 'pulse 3s infinite' }} />
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-teal-500/40 rounded-full" style={{ animation: 'pulse 4s infinite' }} />
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-orange-500/25 rounded-full" style={{ animation: 'pulse 5s infinite' }} />
          <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-teal-500/35 rounded-full" style={{ animation: 'pulse 3.5s infinite' }} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#f46530]">qlynk</div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <a href="/auth/login" className="text-[#2a2e30] hover:text-[#f46530] px-4 py-2 text-sm font-semibold transition-colors">
                Log in
              </a>
              <a href="/auth/signup" className="bg-[#f46530] hover:bg-[#c14f22] text-white px-6 py-2.5 rounded-lg font-bold transition-all">
                Get Started
              </a>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#2a2e30] hover:text-[#f46530] p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-200/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/auth/login" className="text-[#2a2e30] hover:text-[#f46530] block px-3 py-2 text-base font-medium">Log in</a>
              <a href="/auth/signup" className="bg-[#f46530] hover:bg-[#c14f22] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full block text-center mt-4">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 bg-[#f46530]/10 border border-[#f46530]/20 text-[#f46530] rounded-full text-sm font-semibold">
            <Sparkles size={16} className="text-[#f46530]" />
            Your presence, in a blink
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-[#2a2e30]">
            Built for{' '}
            <span className="text-[#f46530]">
              {text}
              <span className="animate-blink">|</span>
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#474c4e] mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a stunning personal webpage in minutes. No coding, no design skills needed. 
            Just answer a few questions and let <span className="font-bold text-[#f46530]">qlynk</span> do the magic.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a 
              href="/create"
              className="group inline-flex items-center justify-center gap-2 bg-[#f46530] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c14f22] transition-all hover:shadow-lg hover:shadow-[#f46530]/30 hover:-translate-y-0.5"
            >
              Start Building Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center bg-white border-2 border-gray-200 text-[#2a2e30] px-8 py-4 rounded-lg font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-0.5"
            >
              See How It Works
            </a>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="text-3xl font-bold mb-2 text-[#f46530]">500+</div>
              <div className="text-[#474c4e]">Active Users</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="text-3xl font-bold mb-2 text-[#f46530]">15K+</div>
              <div className="text-[#474c4e]">Pages Created</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="text-3xl font-bold mb-2 text-[#f46530]">99.9%</div>
              <div className="text-[#474c4e]">Uptime</div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-orange-500/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20 relative z-10 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-[#f46530]/20 hover:scale-105 hover:border-[#f46530] transition-all duration-300 group border border-gray-200">
              <div className="w-12 h-12 bg-[#f46530]/10 rounded-lg flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-[#f46530]/50 group-hover:scale-110 transition-all duration-300">
                <Zap className="text-[#f46530]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#2a2e30] mb-2 group-hover:text-[#f46530] transition-colors duration-300">Lightning Fast</h3>
              <p className="text-[#474c4e] leading-relaxed group-hover:text-[#2a2e30] transition-colors">
                Create your page in under 2 minutes. No technical knowledge required.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-[#f46530]/20 hover:scale-105 hover:border-[#f46530] transition-all duration-300 group border border-gray-200">
              <div className="w-12 h-12 bg-[#f46530]/10 rounded-lg flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-[#f46530]/50 group-hover:scale-110 transition-all duration-300">
                <Palette className="text-[#f46530]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#2a2e30] mb-2 group-hover:text-[#f46530] transition-colors duration-300">Beautiful Themes</h3>
              <p className="text-[#474c4e] leading-relaxed group-hover:text-[#2a2e30] transition-colors">
                Choose from 5 professionally designed templates that look amazing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-[#f46530]/20 hover:scale-105 hover:border-[#f46530] transition-all duration-300 group border border-gray-200">
              <div className="w-12 h-12 bg-[#f46530]/10 rounded-lg flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-[#f46530]/50 group-hover:scale-110 transition-all duration-300">
                <Shield className="text-[#f46530]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#2a2e30] mb-2 group-hover:text-[#f46530] transition-colors duration-300">100% Free</h3>
              <p className="text-[#474c4e] leading-relaxed group-hover:text-[#2a2e30] transition-colors">
                No hidden costs. Your page stays online forever, completely free.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 hover:shadow-lg hover:shadow-[#f46530]/20 hover:scale-105 hover:border-[#f46530] transition-all duration-300 group border border-gray-200">
              <div className="w-12 h-12 bg-[#f46530]/10 rounded-lg flex items-center justify-center mb-5 group-hover:shadow-lg group-hover:shadow-[#f46530]/50 group-hover:scale-110 transition-all duration-300">
                <BarChart3 className="text-[#f46530]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#2a2e30] mb-2 group-hover:text-[#f46530] transition-colors duration-300">Track Analytics</h3>
              <p className="text-[#474c4e] leading-relaxed group-hover:text-[#2a2e30] transition-colors">
                See how many people visit your page and engage with your content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2a2e30] mb-4 tracking-tight">How It Works</h2>
            <p className="text-xl text-[#474c4e]">Three simple steps to your new online presence</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f46530] rounded-xl text-white text-2xl font-black mx-auto mb-6 shadow-lg shadow-[#f46530]/30 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-2xl font-bold text-[#2a2e30] mb-3">Answer Questions</h3>
              <p className="text-[#474c4e] leading-relaxed">
                Tell us about yourself in a simple guided form. Takes just 2 minutes.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f46530] rounded-xl text-white text-2xl font-black mx-auto mb-6 shadow-lg shadow-[#f46530]/30 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-2xl font-bold text-[#2a2e30] mb-3">Pick a Theme</h3>
              <p className="text-[#474c4e] leading-relaxed">
                Choose from 5 beautiful designs. See your page update in real-time.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f46530] rounded-xl text-white text-2xl font-black mx-auto mb-6 shadow-lg shadow-[#f46530]/30 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-2xl font-bold text-[#2a2e30] mb-3">Go Live</h3>
              <p className="text-[#474c4e] leading-relaxed">
                Your page is instantly live at qlynk.page/yourname. Share it everywhere!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative z-10 bg-[#f2f2f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-2xl relative overflow-hidden border border-gray-200">
            {/* Accent glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#f46530]/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#f46530]/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-[#2a2e30] mb-6">Ready to Stand Out?</h2>
              <p className="text-xl text-[#474c4e] mb-10 max-w-2xl mx-auto">
                Join thousands of professionals, creators, and businesses who trust qlynk for their online presence.
              </p>
              <a 
                href="/auth/signup"
                className="inline-flex items-center gap-3 bg-[#f46530] text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-[#c14f22] transition-all hover:shadow-2xl hover:shadow-[#f46530]/30 hover:scale-105"
              >
                Create Your Page Now
                <ArrowRight size={24} />
              </a>
              <p className="text-[#474c4e] text-sm mt-6">
                Free forever • No credit card • 2 minute setup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#2a2e30] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold text-[#f46530]">qlynk</div>
            <div className="text-gray-400 text-sm">
              © 2025 qlynk. Your presence, in a blink.
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .particle {
          position: absolute;
          width: 1px;
          height: 1px;
          background: #f46530;
          border-radius: 50%;
          opacity: 0.3;
          animation: particleFloat 30s infinite linear;
        }
        
        .data-stream {
          position: absolute;
          width: 3px;
          height: 120px;
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(244, 101, 48, 0.8) 20%, 
            rgba(244, 101, 48, 1) 50%, 
            rgba(244, 101, 48, 0.8) 80%, 
            transparent 100%);
          animation: data-flow 4s linear infinite;
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(244, 101, 48, 0.5);
        }
        
        .data-stream::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(255, 255, 255, 0.9) 20%, 
            rgba(255, 255, 255, 1) 50%, 
            rgba(255, 255, 255, 0.9) 80%, 
            transparent 100%);
        }
        
        @keyframes particleFloat {
          0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) translateX(100px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes data-flow {
          0% { transform: translateY(-120px); opacity: 0; }
          10% { opacity: 0.3; }
          50% { opacity: 1; }
          90% { opacity: 0.3; }
          100% { transform: translateY(calc(100vh + 120px)); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}