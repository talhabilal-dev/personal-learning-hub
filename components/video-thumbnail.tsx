"use client";

import { useState, useCallback } from "react";
import { Play, FileVideo } from "lucide-react";
import { FilePicker } from "./file-picker";
import type { Video } from "@/contexts/video-context";
import Image from "next/image";

interface VideoThumbnailProps {
  video: Video;
  onFileAssociated?: (file: File) => void;
  className?: string;
  showPlayButton?: boolean;
  onClick?: () => void;
}

export function VideoThumbnail({
  video,
  onFileAssociated,
  className = "",
  showPlayButton = false,
  onClick,
}: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const hasFile = !!video.file;

  const generateThumbnail = useCallback(async () => {
    if (!video.file) return;

    try {
      const url = URL.createObjectURL(video.file);
      const video_element = document.createElement("video");

      video_element.onloadedmetadata = () => {
        // Seek to 10% of the video or 5 seconds, whichever is smaller
        const seekTime = Math.min(video_element.duration * 0.1, 5);
        video_element.currentTime = seekTime;
      };

      video_element.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video_element.videoWidth;
        canvas.height = video_element.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video_element, 0, 0);
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
          setThumbnail(thumbnailUrl);
        }

        URL.revokeObjectURL(url);
      };

      video_element.src = url;
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  }, [video.file]);

  const handleFileSelected = (file: File) => {
    if (onFileAssociated) {
      onFileAssociated(file);
    }
  };

  const handleClick = () => {
    if (onClick && hasFile) {
      onClick();
    }
  };

  // Generate thumbnail when component is rendered with a file
  if (hasFile && !thumbnail) {
    generateThumbnail();
  }

  if (!hasFile) {
    return (
      <FilePicker
        videoName={video.name}
        expectedFileName={video.filePath}
        onFileSelected={handleFileSelected}
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={video.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <FileVideo className="w-8 h-8 text-foreground/40" />
          </div>
        )}

        {/* Progress bar */}
        {video.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${video.progress}%` }}
            />
          </div>
        )}

        {/* Play button overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-background ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
