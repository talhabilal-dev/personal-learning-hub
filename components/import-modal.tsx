"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useVideoLibrary } from "@/contexts/video-context";
import { X, Upload } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlaylistId?: string;
}

export function ImportModal({
  isOpen,
  onClose,
  selectedPlaylistId,
}: ImportModalProps) {
  const { addVideos, playlists, createNewPlaylist } = useVideoLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [targetPlaylistId, setTargetPlaylistId] = useState(
    selectedPlaylistId || "default"
  );
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newPlaylistColor, setNewPlaylistColor] = useState("#3b82f6");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (files) {
      const videoFiles = Array.from(files).filter((file) =>
        file.type.startsWith("video/")
      );
      if (videoFiles.length > 0) {
        if (targetPlaylistId === "create-new") {
          setPendingFiles(videoFiles);
          setShowCreatePlaylist(true);
        } else {
          await addVideos(videoFiles, targetPlaylistId);
          onClose();
        }
      }
    }
  };

  const handleCreatePlaylistAndImport = async () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = await createNewPlaylist(
        newPlaylistName.trim(),
        newPlaylistDescription.trim() || undefined,
        newPlaylistColor
      );
      await addVideos(pendingFiles, newPlaylist.id);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setShowCreatePlaylist(false);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setNewPlaylistColor("#3b82f6");
    setPendingFiles([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {showCreatePlaylist ? "Create New Playlist" : "Import Videos"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {showCreatePlaylist ? (
          /* Create Playlist Form */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Playlist Name *
              </label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Describe this playlist..."
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Color Theme
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newPlaylistColor}
                  onChange={(e) => setNewPlaylistColor(e.target.value)}
                  className="w-12 h-8 rounded border border-border cursor-pointer"
                />
                <span className="text-sm text-foreground/60">
                  Choose a color to identify this playlist
                </span>
              </div>
            </div>

            <div className="text-sm text-foreground/60 bg-secondary/50 p-3 rounded-lg">
              📁 <strong>{pendingFiles.length}</strong> video
              {pendingFiles.length !== 1 ? "s" : ""} ready to import
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreatePlaylistAndImport}
                disabled={!newPlaylistName.trim()}
                className="flex-1 px-4 py-2 bg-accent/20 hover:bg-accent/30 disabled:bg-accent/10 disabled:cursor-not-allowed text-accent font-medium rounded-lg transition-colors"
              >
                Create & Import
              </button>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setPendingFiles([]);
                }}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          /* Import Form */
          <div>
            {/* Playlist Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Add to Playlist
              </label>
              <select
                value={targetPlaylistId}
                onChange={(e) => setTargetPlaylistId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
                <option value="create-new">+ Create New Playlist</option>
              </select>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragging
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <Upload className="w-8 h-8 text-accent/60 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag and drop videos here
              </p>
              <p className="text-xs text-foreground/60">or click to select</p>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            {/* Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-6 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent font-medium rounded-lg transition-colors"
            >
              Select Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
