"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { ImportModal } from "./import-modal";
import { Play, Zap, BookOpen } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const { videos } = useVideoLibrary();
  const [showImportModal, setShowImportModal] = useState(false);

  const handleStartLearning = () => {
    if (videos.length > 0) {
      router.push("/library");
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-linear-to-b from-background via-secondary to-background overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary rounded-full mix-blend-screen blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        {/* Header with title and progress */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-accent tracking-widest uppercase">
              Learn at your pace
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight text-foreground">
              Master{" "}
              <span className="bg-linear-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                from your library
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 bg-card border border-border rounded-lg p-4 md:p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Progress
            </p>
            <div className="space-y-2 w-full">
              <div className="h-2 w-48 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-accent to-primary rounded-full transition-all duration-500"
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
              <p className="text-sm text-foreground font-medium">
                {videos.filter((v) => v.watched).length} / {videos.length}{" "}
                videos
              </p>
            </div>
          </div>
        </div>

        {/* Main description */}
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 leading-relaxed">
          Organize, track, and learn from your own collection of videos.
          Completely offline. No distractions. Just pure focus.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={handleStartLearning}
            disabled={videos.length === 0}
            className="px-8 py-4 bg-linear-to-r from-accent to-primary text-accent-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <Play className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            Start learning
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-8 py-4 border border-border bg-card/30 hover:bg-card/50 text-foreground font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            Import videos
          </button>
        </div>

        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-border/20">
          <div className="space-y-3 pt-6">
            <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Zero latency</h3>
            <p className="text-sm text-foreground/60">
              All videos processed and stored locally on your device.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Smart tracking</h3>
            <p className="text-sm text-foreground/60">
              Automatic progress tracking with visual insights and analytics.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center">
              <span className="text-accent font-bold">∞</span>
            </div>
            <h3 className="font-semibold text-foreground">Your library</h3>
            <p className="text-sm text-foreground/60">
              Unlimited videos with custom organization and tagging.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-foreground/40 animate-bounce">
          <p className="text-xs uppercase tracking-widest font-medium">
            Scroll
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
      </div>
    </section>
  );
}
