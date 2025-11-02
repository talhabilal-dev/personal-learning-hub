"use client";

import { useParams, useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  SkipBack,
  SkipForward,
  Keyboard,
  Quote as QuoteIcon,
} from "lucide-react";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import { FilePicker } from "@/components/file-picker";

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const {
    videos,
    currentVideo,
    updateProgress,
    setCurrentVideo,
    associateFileWithVideo,
    isLoading,
  } = useVideoLibrary();
  const videoId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  const video = currentVideo || videos.find((v) => v.id === videoId);

  // Get navigation videos
  const currentIndex = videos.findIndex((v) => v.id === videoId);
  const previousVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  // Use video progress as default
  const [progress, setProgress] = useState(video?.progress || 0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  // Load a motivational quote
  useEffect(() => {
    const loadQuote = async () => {
      const quote = await getRandomQuote();
      setCurrentQuote(quote);
    };
    loadQuote();
  }, [video?.id]); // New quote for each video

  // Set video current time when video loads
  useEffect(() => {
    if (video && videoRef.current && videoRef.current.readyState >= 1) {
      videoRef.current.currentTime = video.currentTime || 0;
    }
  }, [video?.id, video?.currentTime, video]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current || !video?.file) return;

      const videoElement = videoRef.current;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
          break;
        case "ArrowRight":
          e.preventDefault();
          videoElement.currentTime = Math.min(
            videoElement.duration,
            videoElement.currentTime + 10
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          videoElement.volume = Math.min(1, videoElement.volume + 0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          videoElement.volume = Math.max(0, videoElement.volume - 0.1);
          break;
        case "KeyF":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoElement.requestFullscreen();
          }
          break;
        case "KeyH":
          e.preventDefault();
          setShowShortcuts((prev) => !prev);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [video?.file]);

  const navigateToVideo = (targetVideo: typeof video | null) => {
    if (targetVideo) {
      setCurrentVideo(targetVideo);
      router.push(`/player/${targetVideo.id}`);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading video...</p>
      </main>
    );
  }

  if (!video) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 mb-4">Video not found</p>
          <button
            onClick={() => router.push("/library")}
            className="px-6 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
          >
            Back to Library
          </button>
        </div>
      </main>
    );
  }

  const handleProgressChange = async (
    newProgress: number,
    currentTime: number
  ) => {
    setProgress(newProgress);
    await updateProgress(videoId, newProgress, currentTime);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => router.push("/library")}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </button>

        {/* Video player */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
          <div className="w-full aspect-video bg-secondary flex items-center justify-center">
            {video.file ? (
              <video
                ref={videoRef}
                key={video.id}
                controls
                className="w-full h-full"
                onTimeUpdate={(e) => {
                  const vid = e.currentTarget as HTMLVideoElement;
                  const percent = (vid.currentTime / vid.duration) * 100;
                  handleProgressChange(percent, vid.currentTime);
                }}
                onLoadedMetadata={() => {
                  if (video && videoRef.current) {
                    videoRef.current.currentTime = video.currentTime || 0;
                  }
                }}
              >
                <source
                  src={URL.createObjectURL(video.file)}
                  type={video.file.type}
                />
              </video>
            ) : (
              <FilePicker
                videoName={video.name}
                expectedFileName={video.filePath}
                onFileSelected={(file) => {
                  associateFileWithVideo(video.id, file);
                  // Reload the component to show the video
                  window.location.reload();
                }}
                className="w-full max-w-md mx-auto"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">{video.name}</h1>
            <span className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-full">
              Video #{video.sequence + 1}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigateToVideo(previousVideo)}
              disabled={!previousVideo}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
            >
              <SkipBack className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="text-sm text-foreground/60 text-center shrink-0">
              {currentIndex + 1} of {videos.length}
            </span>

            <button
              onClick={() => navigateToVideo(nextVideo)}
              disabled={!nextVideo}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
            >
              <span className="hidden sm:inline">Next</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard shortcuts help */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowShortcuts((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors text-sm ${
                video.file
                  ? "bg-card/50 hover:bg-card/70 text-foreground/60"
                  : "bg-muted/30 text-foreground/30 cursor-not-allowed"
              }`}
              disabled={!video.file}
            >
              <Keyboard className="w-4 h-4" />
              {video.file ? "Shortcuts (H)" : "Shortcuts (disabled)"}
            </button>
          </div>

          {showShortcuts && video.file && (
            <div className="bg-card border border-border rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-foreground mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2 text-foreground/70">
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    Space
                  </kbd>{" "}
                  Play/Pause
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    ←
                  </kbd>{" "}
                  Seek back 10s
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    →
                  </kbd>{" "}
                  Seek forward 10s
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    ↑
                  </kbd>{" "}
                  Volume up
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    ↓
                  </kbd>{" "}
                  Volume down
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    F
                  </kbd>{" "}
                  Fullscreen
                </div>
                <div>
                  <kbd className="bg-secondary px-2 py-1 rounded text-xs">
                    H
                  </kbd>{" "}
                  Toggle help
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-foreground/60">
              {video.watched ? "Completed" : `${Math.round(progress)}% watched`}
            </p>
            <p className="text-sm text-foreground/60">
              Added {new Date(video.addedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-accent to-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Motivational Quote Section */}
          {currentQuote && (
            <div className="mt-8 p-6 bg-card/50 border border-accent/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <QuoteIcon className="w-5 h-5 text-accent mt-1 shrink-0" />
                <div className="space-y-2">
                  <blockquote className="text-foreground font-medium italic">
                    &ldquo;{currentQuote.quote}&rdquo;
                  </blockquote>
                  <footer className="flex items-center gap-2">
                    <cite className="text-accent text-sm font-medium">
                      — {currentQuote.author}
                    </cite>
                    {currentQuote.category && (
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                        {currentQuote.category}
                      </span>
                    )}
                    {currentQuote.source === "api" && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Fresh
                      </span>
                    )}
                  </footer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
