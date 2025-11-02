"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useVideoLibrary } from "@/contexts/video-context";
import { X, Upload } from "lucide-react";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { addVideos } = useVideoLibrary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files) {
      const videoFiles = Array.from(files).filter((file) =>
        file.type.startsWith("video/")
      );
      if (videoFiles.length > 0) {
        addVideos(videoFiles);
        onClose();
      }
    }
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
            Import Videos
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
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
    </div>
  );
}
