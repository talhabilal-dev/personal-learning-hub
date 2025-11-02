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
  loadDB,
  saveDB,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getAllPlaylists,
  moveVideoToPlaylist,
  type VideoData,
  type PlaylistData,
} from "@/lib/db";

export interface Video extends VideoData {
  file: File;
}

export type Playlist = PlaylistData;

interface VideoContextType {
  videos: Video[];
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  addVideos: (files: File[], playlistId?: string) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  updateProgress: (
    id: string,
    progress: number,
    currentTime?: number
  ) => Promise<void>;
  currentVideo: Video | null;
  setCurrentVideo: (video: Video | null) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  createNewPlaylist: (
    name: string,
    description?: string,
    color?: string
  ) => Promise<Playlist>;
  updatePlaylistInfo: (
    id: string,
    updates: Partial<Omit<PlaylistData, "id" | "createdAt">>
  ) => Promise<boolean>;
  deletePlaylistById: (id: string) => Promise<boolean>;
  moveVideoToNewPlaylist: (
    videoId: string,
    targetPlaylistId: string
  ) => Promise<boolean>;
  isLoading: boolean;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileMap, setFileMap] = useState<Map<string, File>>(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load playlists
        const allPlaylists = await getAllPlaylists();
        setPlaylists(allPlaylists);

        // Set default playlist as current
        const defaultPlaylist =
          allPlaylists.find((p) => p.id === "default") || allPlaylists[0];
        setCurrentPlaylist(defaultPlaylist);

        // Note: Files are not persisted across sessions since they're stored in memory
        // On app reload, only metadata is loaded from database
        // This is intentional for this local-file-based app design
        setVideos([]); // Start with empty array since files aren't persisted
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addVideos = async (files: File[], playlistId?: string) => {
    const targetPlaylistId = playlistId || currentPlaylist?.id || "default";
    const newVideos: Video[] = [];
    const newFileMap = new Map(fileMap);

    for (const file of files) {
      // Create a temporary video element to get duration
      const video = document.createElement("video");
      video.preload = "metadata";

      const videoData = await addVideoToDB(
        {
          name: file.name.replace(/\.[^/.]+$/, ""),
          duration: 0, // Will be updated once metadata loads
          progress: 0,
          currentTime: 0,
          watched: false,
          addedAt: new Date().toISOString(),
          playlistId: targetPlaylistId,
        },
        targetPlaylistId
      );

      video.onloadedmetadata = async () => {
        // Update the duration in the database once metadata is loaded
        await updateProgressInDB(videoData.id, videoData.progress);
        const db = await loadDB();
        const dbVideo = db.videos.find((v: VideoData) => v.id === videoData.id);
        if (dbVideo) {
          dbVideo.duration = video.duration;
          await saveDB(db);

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

      newFileMap.set(videoData.id, file);
      newVideos.push({
        ...videoData,
        file,
      });
    }

    setFileMap(newFileMap);
    setVideos((prev) => [...prev, ...newVideos]);
  };

  const removeVideo = async (id: string) => {
    await removeVideoFromDB(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (currentVideo?.id === id) {
      setCurrentVideo(null);
    }

    const newFileMap = new Map(fileMap);
    newFileMap.delete(id);
    setFileMap(newFileMap);
  };

  const updateProgress = async (
    id: string,
    progress: number,
    currentTime?: number
  ) => {
    await updateProgressInDB(id, progress, currentTime);
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

  const createNewPlaylist = async (
    name: string,
    description?: string,
    color?: string
  ): Promise<Playlist> => {
    const newPlaylist = await createPlaylist({ name, description, color });
    setPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const updatePlaylistInfo = async (
    id: string,
    updates: Partial<Omit<PlaylistData, "id" | "createdAt">>
  ): Promise<boolean> => {
    const updatedPlaylist = await updatePlaylist(id, updates);
    if (updatedPlaylist) {
      setPlaylists((prev) =>
        prev.map((p) => (p.id === id ? updatedPlaylist : p))
      );
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(updatedPlaylist);
      }
      return true;
    }
    return false;
  };

  const deletePlaylistById = async (id: string): Promise<boolean> => {
    const success = await deletePlaylist(id);
    if (success) {
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      if (currentPlaylist?.id === id) {
        const defaultPlaylist = playlists.find((p) => p.id === "default");
        setCurrentPlaylist(defaultPlaylist || null);
      }
      // Remove videos from this playlist in local state
      setVideos((prev) => prev.filter((v) => v.playlistId !== id));
    }
    return success;
  };

  const moveVideoToNewPlaylist = async (
    videoId: string,
    targetPlaylistId: string
  ): Promise<boolean> => {
    const success = await moveVideoToPlaylist(videoId, targetPlaylistId);
    if (success) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, playlistId: targetPlaylistId } : v
        )
      );
    }
    return success;
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        playlists,
        currentPlaylist,
        addVideos,
        removeVideo,
        updateProgress,
        currentVideo,
        setCurrentVideo,
        setCurrentPlaylist,
        createNewPlaylist,
        updatePlaylistInfo,
        deletePlaylistById,
        moveVideoToNewPlaylist,
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
