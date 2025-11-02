"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { PlaylistManager } from "@/components/playlist-manager";
import {
  FolderOpen,
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  Calendar,
  Edit3,
} from "lucide-react";

export default function PlaylistsPage() {
  const router = useRouter();
  const { playlists, videos } = useVideoLibrary();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );

  const getPlaylistStats = (playlistId: string) => {
    const playlistVideos = videos.filter((v) => v.playlistId === playlistId);
    const watchedVideos = playlistVideos.filter((v) => v.watched);
    const totalDuration = playlistVideos.reduce(
      (acc, v) => acc + v.duration,
      0
    );
    const watchedDuration = watchedVideos.reduce(
      (acc, v) => acc + v.duration,
      0
    );
    const completionRate =
      playlistVideos.length > 0
        ? (watchedVideos.length / playlistVideos.length) * 100
        : 0;

    return {
      totalVideos: playlistVideos.length,
      watchedVideos: watchedVideos.length,
      totalDuration,
      watchedDuration,
      completionRate,
    };
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate overall stats
  const totalVideos = videos.length;
  const totalWatchedVideos = videos.filter((v) => v.watched).length;
  const totalDuration = videos.reduce((acc, v) => acc + v.duration, 0);
  const overallCompletionRate =
    totalVideos > 0 ? (totalWatchedVideos / totalVideos) * 100 : 0;

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-secondary to-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/library")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-4xl font-bold text-foreground">All Playlists</h1>
          <div className="ml-auto text-sm text-foreground/60">
            {playlists.length} playlists • {totalVideos} videos total
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Total Playlists</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {playlists.length}
            </p>
            <p className="text-sm text-foreground/60">Collections created</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Total Videos</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalVideos}</p>
            <p className="text-sm text-foreground/60">Across all playlists</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground">
                Overall Progress
              </h3>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(overallCompletionRate)}%
            </p>
            <p className="text-sm text-foreground/60">
              {totalWatchedVideos} videos watched
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/15 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-foreground">Total Content</h3>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatDuration(totalDuration)}
            </p>
            <p className="text-sm text-foreground/60">Learning material</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Playlists Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Your Playlists
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playlists.map((playlist) => {
                const stats = getPlaylistStats(playlist.id);

                return (
                  <div
                    key={playlist.id}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all cursor-pointer"
                    onClick={() =>
                      router.push(`/library?playlist=${playlist.id}`)
                    }
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full shrink-0"
                            style={{
                              backgroundColor: playlist.color || "#3b82f6",
                            }}
                          />
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {playlist.name}
                          </h3>
                        </div>
                        {playlist.id !== "default" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlaylistId(playlist.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-secondary rounded transition-all"
                          >
                            <Edit3 className="w-4 h-4 text-foreground/60" />
                          </button>
                        )}
                      </div>

                      {playlist.description && (
                        <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                          {playlist.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {stats.totalVideos}
                          </p>
                          <p className="text-xs text-foreground/60">Videos</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {formatDuration(stats.totalDuration)}
                          </p>
                          <p className="text-xs text-foreground/60">Duration</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {Math.round(stats.completionRate)}%
                          </p>
                          <p className="text-xs text-foreground/60">Complete</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {stats.totalVideos > 0 && (
                      <div className="px-6 pb-4">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${stats.completionRate}%`,
                              backgroundColor: playlist.color || "#3b82f6",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-3 bg-secondary/20 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {formatDate(playlist.createdAt)}
                        </span>
                        {stats.watchedVideos > 0 && (
                          <span>{stats.watchedVideos} watched</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playlist Manager Sidebar */}
          <div className="lg:col-span-1">
            <PlaylistManager
              onPlaylistSelect={(playlistId) => {
                router.push(`/library?playlist=${playlistId}`);
              }}
              selectedPlaylistId={selectedPlaylistId || undefined}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
