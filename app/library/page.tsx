"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVideoLibrary } from "@/contexts/video-context";
import { PlaylistManager } from "@/components/playlist-manager";
import {
  Play,
  ArrowLeft,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle,
  FolderOpen,
} from "lucide-react";

export default function LibraryPage() {
  const router = useRouter();
  const {
    videos,
    playlists,
    currentPlaylist,
    setCurrentPlaylist,
    removeVideo,
    setCurrentVideo,
    moveVideoToNewPlaylist,
    isLoading,
  } = useVideoLibrary();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>(
    currentPlaylist?.id || "default"
  );
  const [showPlaylistManager, setShowPlaylistManager] = useState(false);

  const handlePlayVideo = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      setCurrentVideo(video);
      router.push(`/player/${videoId}`);
    }
  };

  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    const playlist = playlists.find((p) => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylist(playlist);
    }
  };

  // Filter videos by selected playlist
  const currentPlaylistVideos = videos.filter(
    (v) => v.playlistId === selectedPlaylistId
  );
  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  // Calculate stats for current playlist
  const watchedVideos = currentPlaylistVideos.filter((v) => v.watched);
  const totalDuration = currentPlaylistVideos.reduce(
    (acc, v) => acc + v.duration,
    0
  );
  const watchedDuration = watchedVideos.reduce((acc, v) => acc + v.duration, 0);
  const completionRate =
    currentPlaylistVideos.length > 0
      ? (watchedVideos.length / currentPlaylistVideos.length) * 100
      : 0;

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
      <main className="min-h-screen bg-gradient-to-b from-background via-secondary to-background flex items-center justify-center">
        <p className="text-foreground/60">Loading your library...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary to-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-4xl font-bold text-foreground">Video Library</h1>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => router.push("/playlists")}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              All Playlists
            </button>
            <button
              onClick={() => setShowPlaylistManager(!showPlaylistManager)}
              className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Manage Playlists
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            {showPlaylistManager ? (
              <PlaylistManager
                onPlaylistSelect={handlePlaylistSelect}
                selectedPlaylistId={selectedPlaylistId}
              />
            ) : (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Playlists
                  </h2>
                  <button
                    onClick={() => setShowPlaylistManager(true)}
                    className="text-sm text-accent hover:text-accent/80"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-2">
                  {playlists.map((playlist) => {
                    const playlistVideoCount = videos.filter(
                      (v) => v.playlistId === playlist.id
                    ).length;
                    const isSelected = selectedPlaylistId === playlist.id;

                    return (
                      <button
                        key={playlist.id}
                        onClick={() => handlePlaylistSelect(playlist.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-accent/20 border border-accent/30"
                            : "hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: playlist.color || "#3b82f6",
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium truncate ${
                                isSelected ? "text-accent" : "text-foreground"
                              }`}
                            >
                              {playlist.name}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {playlistVideoCount} videos
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Playlist Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: selectedPlaylist?.color || "#3b82f6",
                  }}
                />
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedPlaylist?.name || "My Videos"}
                </h2>
                <span className="text-foreground/60">
                  {currentPlaylistVideos.length} videos
                </span>
              </div>
            </div>

            {selectedPlaylist?.description && (
              <p className="text-foreground/70 mb-6">
                {selectedPlaylist.description}
              </p>
            )}

            {currentPlaylistVideos.length > 0 && (
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
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(completionRate)}%
                    </p>
                    <p className="text-sm text-foreground/60">
                      {watchedVideos.length} of {currentPlaylistVideos.length}{" "}
                      videos
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
                    <h3 className="font-semibold text-foreground">
                      Watched Time
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatDuration(watchedDuration)}
                  </p>
                  <p className="text-sm text-foreground/60">
                    Time spent learning
                  </p>
                </div>
              </div>
            )}

            {currentPlaylistVideos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-foreground/60 mb-4">
                  No videos in {selectedPlaylist?.name || "this playlist"} yet
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
                >
                  Import Videos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentPlaylistVideos.map((video) => (
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
                            className="h-full bg-gradient-to-r from-accent to-primary transition-all"
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

                          {/* Move to playlist dropdown */}
                          {playlists.length > 1 && (
                            <select
                              onChange={(e) => {
                                if (
                                  e.target.value &&
                                  e.target.value !== video.playlistId
                                ) {
                                  moveVideoToNewPlaylist(
                                    video.id,
                                    e.target.value
                                  );
                                }
                              }}
                              value=""
                              className="p-1 bg-secondary hover:bg-secondary/80 text-foreground rounded transition-colors text-xs"
                              title="Move to playlist"
                            >
                              <option value="">Move...</option>
                              {playlists
                                .filter((p) => p.id !== video.playlistId)
                                .map((playlist) => (
                                  <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                  </option>
                                ))}
                            </select>
                          )}

                          <button
                            onClick={async () => await removeVideo(video.id)}
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
        </div>
      </div>
    </main>
  );
}
