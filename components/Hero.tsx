"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { ImportModal } from "./import-modal";
import {
  Play,
  Zap,
  BookOpen,
  Infinity,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { videos } = useVideoLibrary();
  const [showImportModal, setShowImportModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    (async () => {
      await setAnimateIn(true);
    })();
  }, []);

  const handleStartLearning = () => {
    if (videos.length > 0) {
      router.push("/library");
    }
  };

  return (
    <div className="dark">
      <section className="relative w-full min-h-screen bg-background overflow-hidden">
        {/* Animated gradient background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-screen blur-3xl animate-float opacity-60"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/20 rounded-full mix-blend-screen blur-3xl animate-float opacity-40"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-screen blur-3xl animate-float opacity-30"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, rgba(112, 198, 233, 0.05) 25%, rgba(112, 198, 233, 0.05) 26%, transparent 27%, transparent 74%, rgba(112, 198, 233, 0.05) 75%, rgba(112, 198, 233, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(112, 198, 233, 0.05) 25%, rgba(112, 198, 233, 0.05) 26%, transparent 27%, transparent 74%, rgba(112, 198, 233, 0.05) 75%, rgba(112, 198, 233, 0.05) 76%, transparent 77%, transparent)",
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          {/* Animated badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-8 transition-all duration-700 ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">
              Distraction-free learning
            </span>
          </div>
          {/* Main title and progress card */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
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
                <h1 className="text-6xl md:text-7xl font-bold text-balance leading-tight text-foreground">
                  Master{" "}
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-glow">
                    from your library
                  </span>
                </h1>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
                Organize, track, and learn from your own collection of videos.
                Completely offline. No distractions. Just pure focus on what
                matters.
              </p>
            </div>

            {/* Progress Card - animated entrance */}
            <div
              className={`transition-all duration-700 ${
                animateIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-card/40 backdrop-blur-xl border border-accent/20 rounded-2xl p-8 hover:bg-card/60 transition-all duration-300 hover:border-accent/40 group">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Your progress
                  </p>
                  <div className="w-2 h-2 bg-accent rounded-full group-hover:animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
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
                    <p className="text-sm text-foreground/60 font-medium">
                      {videos.filter((v) => v.watched).length} of{" "}
                      {videos.length} videos watched
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-primary">
                        {videos.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total videos
                      </p>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-3">
                      <p className="text-2xl font-bold text-accent">
                        {videos.filter((v) => v.watched).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-20 transition-all duration-700 ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <button
              onClick={handleStartLearning}
              disabled={videos.length === 0}
              className="group relative px-8 py-4 bg-gradient-to-r from-accent to-primary text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Play className="w-5 h-5 transition-transform group-hover:translate-x-0.5 relative z-10" />
              <span className="relative z-10">Start learning</span>
            </button>
            <button
              onClick={() => router.push("/playlists")}
              className="group px-8 py-4 border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 hover:border-primary/60"
            >
              <BookOpen className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              View playlists
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="group px-8 py-4 border border-accent/30 bg-card/30 hover:bg-card/60 text-foreground font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 hover:border-accent/60"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              Import videos
            </button>
          </div>
          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            selectedPlaylistId="default"
          />{" "}
          {/* Features Grid - staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-accent/10">
            {[
              {
                icon: Zap,
                title: "Zero latency",
                desc: "All videos processed and stored locally on your device.",
                color: "text-accent",
                bgColor: "bg-accent/10",
                delay: "0ms",
              },
              {
                icon: BookOpen,
                title: "Smart tracking",
                desc: "Automatic progress tracking with visual insights.",
                color: "text-primary",
                bgColor: "bg-primary/10",
                delay: "100ms",
              },
              {
                icon: Infinity,
                title: "Your library",
                desc: "Unlimited videos with custom organization.",
                color: "text-accent",
                bgColor: "bg-accent/10",
                delay: "200ms",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`space-y-4 pt-8 transition-all duration-700 hover:translate-y-[-4px] ${
                  animateIn
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${600 + Number.parseInt(feature.delay)}ms`,
                }}
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-foreground/40 animate-bounce">
          <p className="text-xs uppercase tracking-widest font-medium">
            Scroll to explore
          </p>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-24 bg-secondary/5 border-t border-accent/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
              Why choose VibraLearn?
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Everything you need for focused, offline video learning without
              complexity or distractions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Complete Privacy",
                desc: "Your videos never leave your device. Everything stays local.",
                emoji: "🔒",
              },
              {
                title: "Real-time Progress",
                desc: "Track your learning journey with instant visual feedback.",
                emoji: "📊",
              },
              {
                title: "Instant Replay",
                desc: "Scrub through any video instantly with precise control.",
                emoji: "⏱️",
              },
              {
                title: "Your Collection",
                desc: "Organize unlimited videos your way, no limits.",
                emoji: "📚",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 border border-accent/10 rounded-xl hover:border-accent/40 bg-card/20 hover:bg-card/40 transition-all duration-300 cursor-pointer"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-foreground/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="relative w-full py-24 border-t border-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            Ready to learn smarter?
          </h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Import your first video and start your distraction-free learning
            journey today.
          </p>
          <button
            onClick={() => setShowImportModal(true)}
            className="group relative px-10 py-5 bg-gradient-to-r from-accent to-primary text-background font-semibold rounded-xl hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2 mx-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Get started now</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
          </button>
        </div>
      </section>
    </div>
  );
}
