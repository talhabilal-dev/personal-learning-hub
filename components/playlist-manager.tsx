"use client";

import { useState } from "react";
import { useVideoLibrary } from "@/contexts/video-context";
import { Plus, FolderOpen, Edit3, Trash2 } from "lucide-react";

interface PlaylistManagerProps {
  onPlaylistSelect: (playlistId: string) => void;
  selectedPlaylistId?: string;
}

export function PlaylistManager({
  onPlaylistSelect,
  selectedPlaylistId,
}: PlaylistManagerProps) {
  const {
    playlists,
    videos,
    createNewPlaylist,
    updatePlaylistInfo,
    deletePlaylistById,
  } = useVideoLibrary();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newPlaylistColor, setNewPlaylistColor] = useState("#3b82f6");

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

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createNewPlaylist(
        newPlaylistName.trim(),
        newPlaylistDescription.trim() || undefined,
        newPlaylistColor
      );
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setNewPlaylistColor("#3b82f6");
      setShowCreateForm(false);
    }
  };

  const handleUpdatePlaylist = (playlistId: string) => {
    if (newPlaylistName.trim()) {
      updatePlaylistInfo(playlistId, {
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || undefined,
        color: newPlaylistColor,
      });
      setEditingPlaylist(null);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setNewPlaylistColor("#3b82f6");
    }
  };

  const startEditing = (playlist: {
    id: string;
    name: string;
    description?: string;
    color?: string;
  }) => {
    setEditingPlaylist(playlist.id);
    setNewPlaylistName(playlist.name);
    setNewPlaylistDescription(playlist.description || "");
    setNewPlaylistColor(playlist.color || "#3b82f6");
  };

  const cancelEditing = () => {
    setEditingPlaylist(null);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setNewPlaylistColor("#3b82f6");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Playlists</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Playlist
        </button>
      </div>

      {/* Create playlist form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-3">
            Create New Playlist
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newPlaylistColor}
                onChange={(e) => setNewPlaylistColor(e.target.value)}
                className="w-8 h-8 rounded border border-border"
              />
              <span className="text-sm text-foreground/60">Choose color</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playlists list */}
      <div className="space-y-3">
        {playlists.map((playlist) => {
          const stats = getPlaylistStats(playlist.id);
          const isSelected = selectedPlaylistId === playlist.id;
          const isEditing = editingPlaylist === playlist.id;

          if (isEditing) {
            return (
              <div
                key={playlist.id}
                className="p-4 bg-secondary/50 rounded-lg border border-border"
              >
                <h3 className="font-medium text-foreground mb-3">
                  Edit Playlist
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="text"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newPlaylistColor}
                      onChange={(e) => setNewPlaylistColor(e.target.value)}
                      className="w-8 h-8 rounded border border-border"
                    />
                    <span className="text-sm text-foreground/60">
                      Choose color
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdatePlaylist(playlist.id)}
                      className="px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={playlist.id}
              className={`group p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50 bg-card/50"
              }`}
              onClick={() => onPlaylistSelect(playlist.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: playlist.color || "#3b82f6" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderOpen className="w-4 h-4 text-foreground/60" />
                      <h3 className="font-medium text-foreground truncate">
                        {playlist.name}
                      </h3>
                    </div>
                    {playlist.description && (
                      <p className="text-sm text-foreground/60 mb-2 line-clamp-2">
                        {playlist.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-foreground/60">
                      <span>{stats.totalVideos} videos</span>
                      {stats.totalDuration > 0 && (
                        <span>{formatDuration(stats.totalDuration)}</span>
                      )}
                      {stats.totalVideos > 0 && (
                        <span>
                          {Math.round(stats.completionRate)}% complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {playlist.id !== "default" && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(playlist);
                      }}
                      className="p-1 hover:bg-secondary rounded text-foreground/60 hover:text-foreground"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm(
                            `Delete playlist "${playlist.name}"? Videos will be moved to the default playlist.`
                          )
                        ) {
                          deletePlaylistById(playlist.id);
                        }
                      }}
                      className="p-1 hover:bg-red-500/20 rounded text-foreground/60 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {stats.totalVideos > 0 && (
                <div className="mt-3">
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
