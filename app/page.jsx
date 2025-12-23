'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Palette, Shield, BarChart3, Sparkles, ChevronUp, Users, Heart, Target } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import QlynkBackground from '@/components/QlynkBackground';

// ====== Animated Components ======
const AnimatedNumber = ({ value, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetValue = parseInt(value.replace(/\D/g, '')) || 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * targetValue);

      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  if (!mounted) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {displayValue.toLocaleString()}{value.includes('%') ? '%' : value.replace(/\d+/g, '')}
    </span>
  );
};

const GlowingOrb = ({ top, left, size = 300, color = 'orange', delay = 0 }) => (
  <motion.div
    className="absolute rounded-full opacity-20 blur-3xl pointer-events-none z-0"
    style={{
      top,
      left,
      width: size,
      height: size,
      background: color === 'orange'
        ? `radial-gradient(circle, #f46530, transparent 70%)`
        : 'radial-gradient(circle, #2AB59E, transparent 70%)',
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.4, 0.2],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// ====== Slot Machine Hero Component ======
const SlotMachineHero = () => {
  const names = ['Alex', 'Maya', 'Jordan', 'Riley', 'Sam', 'Taylor', 'Casey', 'Morgan'];
  const styles = ['🎨', '💎', '🌟', '⚡', '🔥', '✨', '🎯', '🚀'];
  const professions = ['Designer', 'Developer', 'Artist', 'Writer', 'Founder', 'Creator', 'Musician', 'Coach'];

  const [reel1Index, setReel1Index] = useState(0);
  const [reel2Index, setReel2Index] = useState(0);
  const [reel3Index, setReel3Index] = useState(0);
  const [counter, setCounter] = useState(10247);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinTimeoutRef = useRef(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Update counter with animation
    setCounter(prev => prev + 1);

    // Generate new random indices
    const newIdx1 = Math.floor(Math.random() * names.length);
    const newIdx2 = Math.floor(Math.random() * styles.length);
    const newIdx3 = Math.floor(Math.random() * professions.length);

    // Animate reels with staggered timing
    setTimeout(() => setReel1Index(newIdx1), 100);
    setTimeout(() => setReel2Index(newIdx2), 600);
    setTimeout(() => setReel3Index(newIdx3), 1100);

    // Reset spinning state after animation
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => setIsSpinning(false), 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[#f46530] bg-gray-800/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <span className="text-sm font-bold tracking-wide text-[#f46530]">
              YOUR PRESENCE, IN A BLINK
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Spin to see what <span className="bg-gradient-to-r from-[#f46530] to-[#c14f22] bg-clip-text text-transparent">you could build</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Every spin is a real portfolio you could create in minutes. No two are the same. Find your inspiration.
          </motion.p>
        </div>

        {/* Slot Machine */}
        <motion.div
          className="max-w-4xl mx-auto p-8 rounded-3xl bg-gray-800/50 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-3xl bg-[#f46530]/20 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
            {/* Name Reel */}
            <div className="space-y-3">
              <div className="text-center text-sm font-bold text-gray-400">
                NAME
              </div>
              <div className="reel-container rounded-2xl border-2 border-gray-700 bg-gray-900/50 h-32 flex items-center justify-center">
                <motion.div
                  className="text-4xl font-bold text-white"
                  key={`name-${reel1Index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {names[reel1Index]}
                </motion.div>
              </div>
            </div>

            {/* Style Reel */}
            <div className="space-y-3">
              <div className="text-center text-sm font-bold text-gray-400">
                STYLE
              </div>
              <div className="reel-container rounded-2xl border-2 border-gray-700 bg-gray-900/50 h-32 flex items-center justify-center">
                <motion.div
                  className="text-5xl"
                  key={`style-${reel2Index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {styles[reel2Index]}
                </motion.div>
              </div>
            </div>

            {/* Profession Reel */}
            <div className="space-y-3">
              <div className="text-center text-sm font-bold text-gray-400">
                FOR
              </div>
              <div className="reel-container rounded-2xl border-2 border-gray-700 bg-gray-900/50 h-32 flex items-center justify-center">
                <motion.div
                  className="text-2xl font-bold text-white"
                  key={`prof-${reel3Index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {professions[reel3Index]}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6 relative z-10">
            <motion.button
              className="px-12 py-5 rounded-xl text-xl font-black bg-[#f46530] text-white shadow-lg shadow-[#f46530]/30 relative overflow-hidden"
              onClick={spin}
              disabled={isSpinning}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <span className="relative z-10">🎰 SPIN THE WHEEL</span>
            </motion.button>
            <div className="text-sm text-gray-400">
              Click to see another combination
            </div>
          </div>
        </motion.div>

        {/* Live Counter */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gray-800/50">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-[#f46530]"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [1, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <div className="w-4 h-4 rounded-full relative z-10 bg-[#f46530]"></div>
            </div>
            <div>
              <motion.div
                className="text-4xl font-black text-[#f46530]"
                key={counter}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {counter.toLocaleString()}
              </motion.div>
              <div className="text-sm text-gray-400">
                portfolios created today
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.a
            href="/create"
            className="px-12 py-6 rounded-xl text-xl font-bold bg-[#f46530] text-white shadow-lg shadow-[#f46530]/30 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building Yours Free
          </motion.a>
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#f46530]">✓</span>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#f46530]">✓</span>
              <span>3 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#f46530]">✓</span>
              <span>Free forever</span>
            </div>
          </div>
        </motion.div>

        {/* Example Cards */}
        <motion.div
          className="grid sm:grid-cols-3 gap-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <motion.div
            className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:border-[#f46530] transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">🎨</div>
            <div className="font-bold mb-2 text-white">Creative Portfolio</div>
            <div className="text-sm text-gray-400">Perfect for designers & artists</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:border-[#f46530] transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">💼</div>
            <div className="font-bold mb-2 text-white">Professional Resume</div>
            <div className="text-sm text-gray-400">Ideal for job seekers</div>
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl border border-gray-700 bg-gray-800/50 hover:border-[#f46530] transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">🚀</div>
            <div className="font-bold mb-2 text-white">Startup Landing</div>
            <div className="text-sm text-gray-400">Great for entrepreneurs</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ====== About Us Section ======
const AboutUs = () => {
  const values = [
    { icon: Users, title: "Our Community", desc: "Built for creators, by creators. We're a growing community of 15,000+ users." },
    { icon: Heart, title: "Our Passion", desc: "We believe everyone deserves a beautiful online home without the complexity." },
    { icon: Target, title: "Our Mission", desc: "To provide the simplest and fastest way to build your professional presence." }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-sm">
              <Users size={16} />
              WHO WE ARE
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Empowering your digital <span className="text-orange">identity</span> since 2024.
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Qlynk started with a simple idea: why is it so hard to make a personal page that looks professional and works perfectly on mobile? We removed the friction and kept the magic.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 pt-4">
              <div className="text-center p-4 rounded-2xl bg-gray-800/40 border border-gray-700">
                <div className="text-3xl font-black text-orange mb-1">100%</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">User Focused</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-800/40 border border-gray-700">
                <div className="text-3xl font-black text-orange mb-1">24/7</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Speed Optimized</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-gray-800/40 border border-gray-700">
                <div className="text-3xl font-black text-orange mb-1">Free</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Forever Policy</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2 grid grid-cols-1 gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {values.map((v, i) => (
              <div key={i} className="flex gap-6 p-8 rounded-3xl bg-gray-800/30 border border-gray-700 hover:border-orange/30 transition-all group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-all">
                  <v.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ====== Scroll To Top Component ======
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] w-14 h-14 rounded-full bg-orange text-white shadow-2xl shadow-orange/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
          aria-label="Scroll to top"
        >
          <ChevronUp size={28} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// ====== Main App ======
export default function App() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);

  const words = ['Professionals', 'Creators', 'Freelancers', 'Products', 'Businesses', 'Everyone'];

  // Scroll-linked animations
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scaleBg = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Typing effect
  useEffect(() => {
    const TYPE_SPEED = 90;
    const DELETE_SPEED = 45;
    const PAUSE_BEFORE_DELETE = 700;
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
      setText(isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );
    }, isDeleting ? DELETE_SPEED : TYPE_SPEED);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words]);

  // Stats & Content
  const stats = [
    { value: "500+", label: "Active Users" },
    { value: "15K+", label: "Pages Created" },
    { value: "99.9%", label: "Uptime" }
  ];

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Create your page in under 2 minutes. No technical knowledge required." },
    { icon: Palette, title: "Beautiful Themes", desc: "Choose from 5 professionally designed templates that look amazing." },
    { icon: Shield, title: "100% Free", desc: "No hidden costs. Your page stays online forever, completely free." },
    { icon: BarChart3, title: "Track Analytics", desc: "See how many people visit your page and engage with your content." }
  ];

  const steps = [
    { num: "1", title: "Answer Questions", desc: "Tell us about yourself in a simple guided form. Takes just 2 minutes." },
    { num: "2", title: "Pick a Theme", desc: "Choose from 5 beautiful designs. See your page update in real-time." },
    { num: "3", title: "Go Live", desc: "Your page is instantly live at qlynk.page/yourname. Share it everywhere!" }
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
    >
      {/* Apply the QlynkBackground component */}
      <QlynkBackground />

      {/* Animated Floating Orbs */}
      <GlowingOrb top="15%" left="5%" size={400} color="orange" delay={0} />
      <GlowingOrb top="75%" left="85%" size={500} color="teal" delay={1} />
      <GlowingOrb top="40%" left="70%" size={300} color="orange" delay={2} />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center justify-center h-16 group">
                <Image
                  src="/logoWhite.svg"
                  alt="qlynk logo"
                  width={125}
                  height={50}
                  priority
                  className="group-hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/auth/login" className="text-gray-300 hover:text-[#f46530] font-medium transition-colors">Log in</Link>
              <motion.a
                href="/auth/signup"
                className="bg-[#f46530] hover:bg-[#c14f22] text-white px-6 py-2.5 rounded-lg font-bold shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-[#f46530] p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-gray-800 border-t border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-2">
                <Link href="/auth/login" className="block px-3 py-2 text-gray-300">Log in</Link>
                <Link
                  href="/auth/signup"
                  className="block bg-[#f46530] text-white text-center px-4 py-2.5 rounded-lg font-medium mt-1"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Slot Machine Version */}
      <section className="min-h-screen pt-24 pb-20 relative z-10 flex items-center">
        <SlotMachineHero />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Powerful. Simple. Free.</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Everything you need to build your digital home.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-[#f46530]/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-[#f46530]/10 flex items-center justify-center mb-6 text-[#f46530] group-hover:bg-[#f46530]/20 group-hover:text-[#f46530] transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#f46530] transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to your new online presence</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gray-700 -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="text-center group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f46530] text-white text-2xl font-black rounded-2xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUs />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-[#f46530] to-[#c14f22] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Stand Out?
          </motion.h2>
          <motion.p
            className="text-xl text-[#ffecd9] mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of professionals, creators, and businesses who trust qlynk for their online presence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#f46530] px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:bg-gray-100 transition-all"
            >
              Create Your Page Now
              <ArrowRight size={24} />
            </Link>
          </motion.div>

          <p className="text-[#ffecd9]/80 text-sm mt-8">
            Free forever • No credit card • 2 minute setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center justify-center mb-8 group">
                <Image
                  src="/logoWhite.svg"
                  alt="qlynk logo"
                  width={125}
                  height={50}
                  priority
                  className="group-hover:scale-105 transition-transform"
                />
              </Link>
            </div>
            <p className="mt-4 md:mt-0">© {new Date().getFullYear()} qlynk. Your presence, in a blink.</p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
