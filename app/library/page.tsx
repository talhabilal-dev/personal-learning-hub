"use client";

import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import {
  Play,
  ArrowLeft,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function LibraryPage() {
  const router = useRouter();
  const { videos, removeVideo, setCurrentVideo, isLoading } = useVideoLibrary();

  const handlePlayVideo = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      setCurrentVideo(video);
      router.push(`/player/${videoId}`);
    }
  };

  // Calculate stats
  const watchedVideos = videos.filter((v) => v.watched);
  const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);
  const watchedDuration = watchedVideos.reduce((acc, v) => acc + v.duration, 0);
  const completionRate =
    videos.length > 0 ? (watchedVideos.length / videos.length) * 100 : 0;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-background via-secondary to-background flex items-center justify-center">
        <p className="text-foreground/60">Loading your library...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary to-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-4xl font-bold text-foreground">
            Your Video Library
          </h1>
          <span className="ml-auto text-foreground/60">
            {videos.length} videos
          </span>
        </div>

        {/* Stats Dashboard */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Completion Rate
                </h3>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-accent to-primary rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(completionRate)}%
                </p>
                <p className="text-sm text-foreground/60">
                  {watchedVideos.length} of {videos.length} videos
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  Total Duration
                </h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatDuration(totalDuration)}
              </p>
              <p className="text-sm text-foreground/60">
                Total content available
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground">Watched Time</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatDuration(watchedDuration)}
              </p>
              <p className="text-sm text-foreground/60">Time spent learning</p>
            </div>
          </div>
        )}

        {/* Video grid */}
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60 mb-4">No videos imported yet</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
            >
              Import Videos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-secondary flex items-center justify-center overflow-hidden">
                  <Play className="w-12 h-12 text-foreground/20 group-hover:text-accent transition-colors" />
                  {video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                      <div
                        className="h-full bg-linear-to-r from-accent to-primary transition-all"
                        style={{ width: `${video.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm truncate mb-2">
                    {video.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-foreground/60">
                      {video.watched
                        ? "✓ Watched"
                        : video.progress > 0
                        ? `${Math.round(video.progress)}% watched`
                        : video.duration > 0
                        ? formatDuration(video.duration)
                        : "Ready to watch"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayVideo(video.id)}
                        className="p-2 bg-accent/20 hover:bg-accent/30 text-accent rounded transition-colors"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
