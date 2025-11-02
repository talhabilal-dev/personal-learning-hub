"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { ImportModal } from "./import-modal";
import {
  Play,
  Zap,
  Infinity,
  ArrowRight,
  Sparkles,
  BarChart3,
  Lock,
  Wind,
  ChevronDown,
  FolderOpen,
  Monitor,
  CheckCircle,
  Globe,
  Shield,
  Rocket,
} from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { videos } = useVideoLibrary();
  const [showImportModal, setShowImportModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(Math.min(progress * 100, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartLearning = () => {
    if (videos.length > 0) {
      router.push("/library");
    }
  };

  const faqItems = [
    {
      question: "How does offline learning work?",
      answer:
        "All your videos are stored locally on your device using browser storage. No internet connection needed to watch, track progress, or manage your library.",
    },
    {
      question: "Can I import any video format?",
      answer:
        "We support all common video formats including MP4, WebM, and Ogg. Videos are processed and stored on your device for instant access.",
    },
    {
      question: "How is my data backed up?",
      answer:
        "Your data lives in your browser's local storage. You can export your progress anytime, and it persists across sessions.",
    },
    {
      question: "Can I organize videos into playlists?",
      answer:
        "Yes! Create custom playlists, organize videos by topic, and build personalized learning paths tailored to your goals.",
    },
  ];

  const motivationalQuotes = [
    {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      category: "Growth",
    },
    {
      quote: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
      category: "Learning",
    },
    {
      quote:
        "Focus is a matter of deciding what things you're not going to do.",
      author: "John Carmack",
      category: "Focus",
    },
    {
      quote: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      category: "Consistency",
    },
    {
      quote:
        "The only way to learn a new programming language is by writing programs in it.",
      author: "Dennis Ritchie",
      category: "Practice",
    },
    {
      quote: "Stay focused and never give up on your dreams.",
      author: "Anonymous",
      category: "Motivation",
    },
    {
      quote: "Every expert was once a beginner. Every pro was once an amateur.",
      author: "Robin Sharma",
      category: "Inspiration",
    },
    {
      quote:
        "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
      author: "Alexander Graham Bell",
      category: "Focus",
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [dailyQuoteIndex] = useState(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return dayOfYear % motivationalQuotes.length;
  });

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);
    return () => clearInterval(quoteTimer);
  }, [motivationalQuotes.length]);

  return (
    <div className="dark">
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-linear-to-r from-accent to-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden flex items-center">
        {/* Enhanced background with more visual interest */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary/40 to-accent/30 rounded-full mix-blend-screen blur-3xl animate-float opacity-70"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-linear-to-br from-accent/30 to-primary/25 rounded-full mix-blend-screen blur-3xl animate-float opacity-50"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-72 h-72 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-full mix-blend-screen blur-3xl animate-float opacity-40"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Additional accent orbs for depth */}
          <div
            className="absolute top-1/3 right-1/2 w-64 h-64 bg-linear-to-br from-cyan-400/15 to-blue-500/15 rounded-full mix-blend-screen blur-2xl animate-float opacity-60"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-linear-to-br from-violet-400/20 to-purple-500/15 rounded-full mix-blend-screen blur-2xl animate-float opacity-50"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, rgba(112, 198, 233, 0.08) 25%, rgba(112, 198, 233, 0.08) 26%, transparent 27%, transparent 74%, rgba(112, 198, 233, 0.08) 75%, rgba(112, 198, 233, 0.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(112, 198, 233, 0.08) 25%, rgba(112, 198, 233, 0.08) 26%, transparent 27%, transparent 74%, rgba(112, 198, 233, 0.08) 75%, rgba(112, 198, 233, 0.08) 76%, transparent 77%, transparent)",
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>

          {/* Radial gradient overlay for depth */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-900/20 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-900/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-8 transition-all duration-700 ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-sm text-accent font-medium">
              Distraction-free learning
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div
              className={`space-y-6 transition-all duration-700 ${
                animateIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
                  Learn at your pace
                </p>
                <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight text-foreground">
                  Master{" "}
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-glow">
                    from your library
                  </span>
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Your personal learning system. Import your videos, track
                progress in real-time, and focus on what matters most.
                Completely offline. Zero distractions.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground/70">
                    100% Private
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground/70">
                    No Accounts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground/70">
                    Lightning Fast
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-700 ${
                animateIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl border border-accent/30 rounded-2xl p-8 hover:border-accent/60 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-semibold text-accent/70 uppercase tracking-wider">
                    Your Learning Stats
                  </p>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-700"
                        style={{
                          width:
                            videos.length > 0
                              ? `${
                                  (videos.filter((v) => v.watched).length /
                                    videos.length) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-foreground/60 font-medium mt-2">
                      {videos.filter((v) => v.watched).length} of{" "}
                      {videos.length} videos completed
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-primary/20 rounded-xl p-4 border border-primary/30">
                      <p className="text-2xl font-bold text-primary">
                        {videos.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Videos
                      </p>
                    </div>
                    <div className="bg-accent/20 rounded-xl p-4 border border-accent/30">
                      <p className="text-2xl font-bold text-accent">
                        {videos.filter((v) => v.watched).length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed
                      </p>
                    </div>
                    <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
                      <p className="text-2xl font-bold text-purple-400">∞</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Limit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 mt-12 transition-all duration-700 ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <button
              onClick={() => setShowImportModal(true)}
              className="group relative px-8 py-4 bg-linear-to-r from-accent to-primary text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Import Your First Video</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/playlists")}
              className="group px-8 py-4 border-2 border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              View Playlists
            </button>
            <button
              onClick={handleStartLearning}
              disabled={videos.length === 0}
              className="group px-8 py-4 border-2 border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Start Learning
            </button>
          </div>

          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
          />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40 animate-bounce">
            <span className="text-xs uppercase tracking-widest font-medium">
              Scroll to see more
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ===== MOTIVATIONAL QUOTES SECTION ===== */}
      <section className="relative w-full py-16 bg-linear-to-r from-slate-800/50 via-slate-900/80 to-slate-800/50 border-t border-accent/10 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-8 left-1/3 w-32 h-32 bg-linear-to-r from-accent/20 to-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-8 right-1/3 w-24 h-24 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Current quote display */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Daily Motivation
                </span>
              </div>

              <blockquote className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
                "{motivationalQuotes[currentQuoteIndex].quote}"
              </blockquote>

              <footer className="flex items-center justify-center gap-3">
                <div className="w-12 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
                <cite className="text-accent font-medium">
                  {motivationalQuotes[currentQuoteIndex].author}
                </cite>
                <div className="w-12 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
              </footer>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-xs font-medium text-primary">
                  {motivationalQuotes[currentQuoteIndex].category}
                </span>
              </div>
            </div>

            {/* Quote navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {motivationalQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuoteIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuoteIndex
                      ? "bg-accent w-8"
                      : "bg-accent/30 hover:bg-accent/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="relative w-full py-24 bg-linear-to-b from-slate-900 via-slate-800/50 to-slate-900 border-t border-accent/20 overflow-hidden">
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-linear-to-br from-accent/40 to-cyan-400/30 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-linear-to-br from-primary/30 to-violet-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-linear-to-br from-blue-400/25 to-purple-400/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(112, 198, 233, 0.2) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
              <Rocket className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              How It Works
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Get started in 3 simple steps. No setup, no accounts, no
              complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-24 left-1/3 w-1/3 h-0.5 bg-linear-to-r from-accent via-primary to-accent animate-pulse"></div>
            <div
              className="hidden md:block absolute top-24 right-0 w-1/3 h-0.5 bg-linear-to-r from-primary via-accent to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {[
              {
                step: 1,
                icon: Monitor,
                title: "Import Videos",
                desc: "Drag and drop or select video files from your device. Supports all common formats including MP4, WebM, and more.",
                highlight: "Instant Recognition",
              },
              {
                step: 2,
                icon: Play,
                title: "Watch & Track",
                desc: "Press play and watch. Your progress is automatically tracked in real-time as you learn.",
                highlight: "Auto Progress",
              },
              {
                step: 3,
                icon: BarChart3,
                title: "See Your Growth",
                desc: "View beautiful stats showing your learning journey, completion rates, and time invested.",
                highlight: "Visual Insights",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`relative group transition-all duration-700 hover:scale-105 ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${600 + idx * 200}ms` }}
              >
                <div className="relative p-8 rounded-2xl bg-card/60 border border-accent/30 hover:border-accent/60 hover:bg-card/80 transition-all duration-300 backdrop-blur-sm">
                  {/* Step number badge */}
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-linear-to-br from-accent to-primary rounded-full flex items-center justify-center text-background font-bold text-lg shadow-lg animate-pulse">
                    {item.step}
                  </div>

                  {/* Content */}
                  <div className="pt-8 space-y-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-300">
                      <item.icon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          {item.highlight}
                        </span>
                      </div>
                      <p className="text-foreground/60 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              dot <= item.step ? "bg-accent" : "bg-accent/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-foreground/40">
                        Step {item.step} of 3
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>

          {/* Call to action at the bottom */}
          <div className="text-center mt-16">
            <p className="text-foreground/60 mb-6">Ready to get started?</p>
            <button
              onClick={() => setShowImportModal(true)}
              className="group px-6 py-3 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <CheckCircle className="w-4 h-4" />
              Try It Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOCUS & PRODUCTIVITY TIPS SECTION ===== */}
      <section className="relative w-full py-20 bg-linear-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border-t border-accent/10 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-16 left-1/4 w-48 h-48 bg-linear-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-1/4 w-36 h-36 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">
                Focus Mode
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay Focused, Learn Better
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Zero distractions. Maximum learning. Built for deep focus and
              effective studying.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Distraction-Free",
                tip: "No ads, no notifications, no interruptions. Just you and your learning content.",
                color: "green",
              },
              {
                icon: Monitor,
                title: "Offline First",
                tip: "Internet distractions eliminated. Your videos work completely offline for pure focus.",
                color: "blue",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                tip: "Visual progress keeps you motivated and shows real learning achievements.",
                color: "purple",
              },
              {
                icon: Rocket,
                title: "Quick Access",
                tip: "Lightning-fast loading means no waiting, no delays, just instant learning.",
                color: "orange",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-xl bg-card/40 border border-accent/20 hover:border-accent/50 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-${item.color}-500/20 border border-${item.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                </div>

                <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-foreground/60 leading-relaxed">
                  {item.tip}
                </p>

                {/* Focus indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
              </div>
            ))}
          </div>

          {/* Focus quote */}
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-linear-to-r from-card/60 to-card/40 border border-accent/20 backdrop-blur-sm">
              <blockquote className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                &ldquo;Concentrate all your thoughts upon the work at hand. The
                sun&rsquo;s rays do not burn until brought to a focus.&rdquo;
              </blockquote>
              <cite className="text-accent font-medium">
                Alexander Graham Bell
              </cite>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-8 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <div className="w-8 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative w-full py-24 bg-linear-to-b from-slate-800/30 via-slate-900 to-slate-800/50 border-t border-accent/20 overflow-hidden">
        {/* Enhanced animated background grid */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(112, 198, 233, 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
          {/* Floating elements for visual interest */}
          <div
            className="absolute top-20 right-20 w-28 h-28 bg-linear-to-br from-accent/20 to-primary/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-32 left-16 w-36 h-36 bg-linear-to-br from-primary/15 to-violet-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Powerful Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Why You&apos;ll Love It
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Designed specifically for distraction-free learning with features
              that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "100% Private & Offline",
                desc: "Your videos and progress never leave your device. Watch without internet, share nothing with anyone.",
                color: "text-accent",
                bgColor: "bg-accent/20",
                borderColor: "border-accent/30",
                hoverBg: "hover:bg-accent/30",
                benefit: "Complete Privacy",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Instant playback, zero latency. Everything happens locally on your device, no cloud delays ever.",
                color: "text-primary",
                bgColor: "bg-primary/20",
                borderColor: "border-primary/30",
                hoverBg: "hover:bg-primary/30",
                benefit: "Zero Delays",
              },
              {
                icon: BarChart3,
                title: "Smart Progress Tracking",
                desc: "Watch your learning journey with real-time stats, completion percentages, and beautiful visual insights.",
                color: "text-accent",
                bgColor: "bg-accent/20",
                borderColor: "border-accent/30",
                hoverBg: "hover:bg-accent/30",
                benefit: "Visual Analytics",
              },
              {
                icon: Infinity,
                title: "Unlimited Library",
                desc: "Import and organize unlimited videos. No storage limits, no file size restrictions, no boundaries.",
                color: "text-primary",
                bgColor: "bg-primary/20",
                borderColor: "border-primary/30",
                hoverBg: "hover:bg-primary/30",
                benefit: "No Limits",
              },
              {
                icon: Wind,
                title: "Zero Distractions",
                desc: "Clean, minimal interface focused purely on learning. No ads, notifications, or unnecessary clutter.",
                color: "text-accent",
                bgColor: "bg-accent/20",
                borderColor: "border-accent/30",
                hoverBg: "hover:bg-accent/30",
                benefit: "Pure Focus",
              },
              {
                icon: Globe,
                title: "Smart Organization",
                desc: "Create playlists, organize by topic, build personalized learning paths that work for you.",
                color: "text-primary",
                bgColor: "bg-primary/20",
                borderColor: "border-primary/30",
                hoverBg: "hover:bg-primary/30",
                benefit: "Your Way",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group p-6 rounded-2xl border ${
                  feature.borderColor
                } hover:border-opacity-60 bg-card/40 hover:bg-card/70 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${700 + idx * 100}ms` }}
              >
                {/* Icon container */}
                <div
                  className={`w-14 h-14 ${feature.bgColor} ${feature.hoverBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 border ${feature.borderColor}`}
                >
                  <feature.icon
                    className={`w-7 h-7 ${feature.color} group-hover:animate-pulse`}
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <span
                      className={`px-2 py-1 ${feature.bgColor} ${feature.color} text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    >
                      {feature.benefit}
                    </span>
                  </div>
                  <p className="text-foreground/60 text-sm leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>

                {/* Hover effect indicator */}
                <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div
                    className={`w-2 h-2 ${feature.bgColor} rounded-full animate-pulse`}
                  ></div>
                  <span className="text-xs text-foreground/60">Learn more</span>
                  <ArrowRight className="w-3 h-3 text-foreground/60 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300 -z-10`}
                ></div>
              </div>
            ))}
          </div>

          {/* Inspirational quote for Features */}
          <div className="mt-20 mb-16 text-center">
            <div className="max-w-2xl mx-auto p-6 rounded-xl bg-linear-to-r from-card/50 to-card/30 border border-accent/20 backdrop-blur-sm">
              <blockquote className="text-lg md:text-xl font-medium text-foreground mb-3">
                &ldquo;Learning never exhausts the mind.&rdquo;
              </blockquote>
              <cite className="text-accent font-medium">Leonardo da Vinci</cite>
              <div className="mt-3 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-xs text-foreground/60">
                  Keep Learning, Keep Growing
                </span>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 p-6 bg-card/60 border border-accent/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span className="text-foreground/80">
                  Ready to experience distraction-free learning?
                </span>
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-6 py-2 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative w-full py-24 bg-linear-to-b from-slate-800 via-slate-900 to-slate-800 border-t border-accent/20 overflow-hidden">
        {/* Enhanced background with floating elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-linear-to-br from-accent/30 to-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-1/4 w-40 h-40 bg-linear-to-br from-primary/25 to-violet-400/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-28 h-28 bg-linear-to-br from-blue-400/20 to-purple-400/15 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              {
                number: "∞",
                label: "Videos You Can Import",
                subtext: "No limits",
              },
              { number: "0ms", label: "Latency", subtext: "Instant playback" },
              { number: "100%", label: "Private", subtext: "Your data only" },
              {
                number: "0",
                label: "Setup Time",
                subtext: "Start immediately",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="space-y-2 p-6 rounded-xl bg-card/40 border border-accent/20"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <p className="text-foreground font-semibold">{stat.label}</p>
                <p className="text-sm text-foreground/60">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="relative w-full py-24 border-t border-accent/10 bg-gradient-to-b from-slate-900/50 via-slate-800/30 to-slate-900 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>
          <div className="absolute bottom-32 right-1/4 w-48 h-48 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-16 w-32 h-32 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-foreground/60">
              Everything you need to know about your learning system.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-accent/20 bg-card/40 overflow-hidden transition-all duration-300 hover:border-accent/50"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                  className="w-full p-6 flex items-center justify-between text-left group"
                >
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform duration-300 ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-6 text-foreground/60 border-t border-accent/10">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Motivational quote for FAQ section */}
          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-linear-to-r from-card/60 to-card/40 border border-accent/20 backdrop-blur-sm">
              <blockquote className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                &ldquo;Success is the sum of small efforts repeated day in and
                day out.&rdquo;
              </blockquote>
              <cite className="text-accent font-medium">Robert Collier</cite>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-8 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
                <span className="text-sm text-primary">
                  Consistency Builds Excellence
                </span>
                <div className="w-8 h-px bg-linear-to-r from-transparent via-accent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="relative w-full py-32 border-t border-accent/10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute top-16 right-16 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-16 w-48 h-48 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-balance mb-6">
            Ready to take control of your learning?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Start now. Import your videos. Zero friction. Zero distractions.
            Pure learning.
          </p>

          {/* Quote of the Day Feature */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-linear-to-r from-card/70 to-card/50 border border-accent/30 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-sm font-medium text-accent">
                  Today&rsquo;s Learning Inspiration
                </span>
                <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              </div>
              <blockquote className="text-lg md:text-xl font-semibold text-foreground text-center mb-3">
                &ldquo;{motivationalQuotes[dailyQuoteIndex].quote}&rdquo;
              </blockquote>
              <div className="text-center">
                <cite className="text-accent/80 font-medium">
                  — {motivationalQuotes[dailyQuoteIndex].author}
                </cite>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowImportModal(true)}
              className="group relative px-10 py-5 bg-gradient-to-r from-accent to-primary text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleStartLearning}
              disabled={videos.length === 0}
              className="group px-10 py-5 border-2 border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Start Learning
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
