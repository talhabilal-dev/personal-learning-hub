"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  addVideoToDB,
  updateProgressInDB,
  removeVideoFromDB,
  getVideosFromDB,
  loadDB,
  saveDB,
  type VideoData,
} from "@/lib/db";

export interface Video extends VideoData {
  file: File;
}

interface VideoContextType {
  videos: Video[];
  addVideos: (files: File[]) => void;
  removeVideo: (id: string) => void;
  updateProgress: (id: string, progress: number, currentTime?: number) => void;
  currentVideo: Video | null;
  setCurrentVideo: (video: Video | null) => void;
  isLoading: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileMap, setFileMap] = useState<Map<string, File>>(new Map());

  useEffect(() => {
    const loadVideos = async () => {
      // Note: Files are not persisted across sessions since they're stored in memory
      // On app reload, only metadata is loaded from localStorage
      // This is intentional for this local-file-based app design
      setVideos([]); // Start with empty array since files aren't persisted
      setIsLoading(false);
    };
    loadVideos();
  }, []);

  const addVideos = (files: File[]) => {
    const newVideos: Video[] = [];
    const newFileMap = new Map(fileMap);

    files.forEach((file) => {
      // Create a temporary video element to get duration
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        // Update the duration in the database once metadata is loaded
        updateProgressInDB(videoData.id, videoData.progress);
        const db = loadDB();
        const dbVideo = db.videos.find((v) => v.id === videoData.id);
        if (dbVideo) {
          dbVideo.duration = video.duration;
          saveDB(db);

          // Update local state as well
          setVideos((prev) =>
            prev.map((v) =>
              v.id === videoData.id ? { ...v, duration: video.duration } : v
            )
          );
        }
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);

      const videoData = addVideoToDB({
        name: file.name.replace(/\.[^/.]+$/, ""),
        duration: 0, // Will be updated once metadata loads
        progress: 0,
        currentTime: 0,
        watched: false,
        addedAt: new Date().toISOString(),
      });

      newFileMap.set(videoData.id, file);
      newVideos.push({
        ...videoData,
        file,
      });
    });

    setFileMap(newFileMap);
    setVideos((prev) => [...prev, ...newVideos]);
  };

  const removeVideo = (id: string) => {
    removeVideoFromDB(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (currentVideo?.id === id) {
      setCurrentVideo(null);
    }

    const newFileMap = new Map(fileMap);
    newFileMap.delete(id);
    setFileMap(newFileMap);
  };

  const updateProgress = (
    id: string,
    progress: number,
    currentTime?: number
  ) => {
    updateProgressInDB(id, progress, currentTime);
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              progress,
              currentTime:
                currentTime !== undefined ? currentTime : v.currentTime,
              watched: progress >= 95,
            }
          : v
      )
    );
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        addVideos,
        removeVideo,
        updateProgress,
        currentVideo,
        setCurrentVideo,
        isLoading,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoLibrary() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoLibrary must be used within VideoProvider");
  }
  return context;
}
