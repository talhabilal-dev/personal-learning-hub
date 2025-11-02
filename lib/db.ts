export interface VideoData {
    id: string
    name: string
    sequence: number
    duration: number
    progress: number
    currentTime: number
    watched: boolean
    addedAt: string
    playlistId: string
}

export interface PlaylistData {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
    color?: string
}

interface DatabaseSchema {
    videos: VideoData[]
    playlists: PlaylistData[]
    metadata: {
        version: string
        lastUpdated: string
    }
}

const INITIAL_DB: DatabaseSchema = {
    videos: [],
    playlists: [
        {
            id: 'default',
            name: 'My Videos',
            description: 'Default playlist for all videos',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            color: '#3b82f6'
        }
    ],
    metadata: {
        version: "2.0",
        lastUpdated: new Date().toISOString(),
    },
}

// Global cache for the database
let dbCache: DatabaseSchema | null = null;
let dbLoaded = false;

// Initialize database
async function initDB(): Promise<DatabaseSchema> {
    if (dbCache && dbLoaded) return dbCache;

    if (typeof window === "undefined") return INITIAL_DB;

    try {
        const response = await fetch('/api/db', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            // Migrate old format if needed
            if (!data.playlists) {
                data.playlists = INITIAL_DB.playlists;
                data.videos = data.videos?.map((v: VideoData & { playlistId?: string }) => ({
                    ...v,
                    playlistId: v.playlistId || 'default'
                })) || [];
            }
            dbCache = data;
            dbLoaded = true;
            return data;
        }

        // Fallback to localStorage and try to migrate
        const stored = localStorage.getItem('learning_hub_db');
        if (stored) {
            const data = JSON.parse(stored);
            // Migrate old format if needed
            if (!data.playlists) {
                data.playlists = INITIAL_DB.playlists;
                data.videos = data.videos?.map((v: VideoData & { playlistId?: string }) => ({
                    ...v,
                    playlistId: v.playlistId || 'default'
                })) || [];
            }
            dbCache = data;
            dbLoaded = true;
            // Try to save to file
            await saveToFile(data);
            return data;
        }

        // Try to migrate from old localStorage format
        const oldStored = localStorage.getItem('vidlib_db');
        if (oldStored) {
            const oldData = JSON.parse(oldStored);
            const migratedData: DatabaseSchema = {
                videos: oldData.videos?.map((v: VideoData & { playlistId?: string }) => ({
                    ...v,
                    playlistId: 'default'
                })) || [],
                playlists: INITIAL_DB.playlists,
                metadata: {
                    version: "2.0",
                    lastUpdated: new Date().toISOString()
                }
            };
            // Save migrated data and remove old
            dbCache = migratedData;
            dbLoaded = true;
            await saveToFile(migratedData);
            localStorage.removeItem('vidlib_db');
            return migratedData;
        }

        dbCache = INITIAL_DB;
        dbLoaded = true;
        return INITIAL_DB;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        // Fallback to localStorage
        try {
            const stored = localStorage.getItem('learning_hub_db');
            if (stored) {
                const data = JSON.parse(stored);
                dbCache = data;
                dbLoaded = true;
                return data;
            }
        } catch (localError) {
            console.error('Failed to load from localStorage:', localError);
        }
        dbCache = INITIAL_DB;
        dbLoaded = true;
        return INITIAL_DB;
    }
}

// File-based storage functions
async function saveToFile(data: DatabaseSchema): Promise<void> {
    if (typeof window === "undefined") return;

    try {
        const response = await fetch('/api/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to save to file');
        }
    } catch (error) {
        console.error('Failed to save database to file:', error);
        // Fallback to localStorage
        localStorage.setItem('learning_hub_db', JSON.stringify(data));
    }
}

export async function loadDB(): Promise<DatabaseSchema> {
    return await initDB();
}

export async function saveDB(db: DatabaseSchema): Promise<void> {
    if (typeof window === "undefined") return

    db.metadata.lastUpdated = new Date().toISOString()
    dbCache = db;

    // Save to file via API
    await saveToFile(db);

    // Also save to localStorage as fallback
    try {
        localStorage.setItem('learning_hub_db', JSON.stringify(db))
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

export async function addVideoToDB(videoData: Omit<VideoData, "id" | "sequence">, playlistId: string = 'default'): Promise<VideoData> {
    const db = await loadDB()
    const playlist = db.playlists.find((p: PlaylistData) => p.id === playlistId) || db.playlists[0]
    const playlistVideos = db.videos.filter((v: VideoData) => v.playlistId === playlist.id)

    const newVideo: VideoData = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        sequence: playlistVideos.length,
        ...videoData,
        playlistId: playlist.id,
    }
    db.videos.push(newVideo)
    await saveDB(db)
    return newVideo
}

export async function updateProgressInDB(id: string, progress: number, currentTime?: number): Promise<void> {
    const db = await loadDB()
    const video = db.videos.find((v: VideoData) => v.id === id)
    if (video) {
        video.progress = progress
        if (currentTime !== undefined) {
            video.currentTime = currentTime
        }
        video.watched = progress >= 95
        await saveDB(db)
    }
}

export async function removeVideoFromDB(id: string): Promise<void> {
    const db = await loadDB()
    const video = db.videos.find((v: VideoData) => v.id === id)
    if (!video) return

    db.videos = db.videos.filter((v: VideoData) => v.id !== id)
    // Resequence remaining videos in the same playlist
    const playlistVideos = db.videos.filter((v: VideoData) => v.playlistId === video.playlistId)
    playlistVideos.forEach((v: VideoData, idx: number) => {
        v.sequence = idx
    })
    await saveDB(db)
}

export async function getVideosFromDB(playlistId?: string): Promise<VideoData[]> {
    const db = await loadDB()
    let videos = db.videos
    if (playlistId) {
        videos = videos.filter((v: VideoData) => v.playlistId === playlistId)
    }
    return videos.sort((a, b) => a.sequence - b.sequence)
}

export async function getVideoByIdFromDB(id: string): Promise<VideoData | undefined> {
    const db = await loadDB()
    return db.videos.find((v: VideoData) => v.id === id)
}

// Playlist management functions
export async function createPlaylist(playlistData: Omit<PlaylistData, "id" | "createdAt" | "updatedAt">): Promise<PlaylistData> {
    const db = await loadDB()
    const newPlaylist: PlaylistData = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...playlistData,
    }
    db.playlists.push(newPlaylist)
    await saveDB(db)
    return newPlaylist
}

export async function updatePlaylist(id: string, updates: Partial<Omit<PlaylistData, "id" | "createdAt">>): Promise<PlaylistData | null> {
    const db = await loadDB()
    const playlist = db.playlists.find((p: PlaylistData) => p.id === id)
    if (!playlist) return null

    Object.assign(playlist, updates, { updatedAt: new Date().toISOString() })
    await saveDB(db)
    return playlist
}

export async function deletePlaylist(id: string): Promise<boolean> {
    if (id === 'default') return false // Can't delete default playlist

    const db = await loadDB()
    const playlistExists = db.playlists.some((p: PlaylistData) => p.id === id)
    if (!playlistExists) return false

    // Move all videos from this playlist to default
    db.videos.forEach((v: VideoData) => {
        if (v.playlistId === id) {
            v.playlistId = 'default'
        }
    })

    // Remove the playlist
    db.playlists = db.playlists.filter((p: PlaylistData) => p.id !== id)

    // Resequence videos in default playlist
    const defaultVideos = db.videos.filter((v: VideoData) => v.playlistId === 'default')
    defaultVideos.forEach((v: VideoData, idx: number) => {
        v.sequence = idx
    })

    await saveDB(db)
    return true
}

export async function getAllPlaylists(): Promise<PlaylistData[]> {
    const db = await loadDB()
    return db.playlists.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getPlaylistById(id: string): Promise<PlaylistData | undefined> {
    const db = await loadDB()
    return db.playlists.find((p: PlaylistData) => p.id === id)
}

export async function moveVideoToPlaylist(videoId: string, targetPlaylistId: string): Promise<boolean> {
    const db = await loadDB()
    const video = db.videos.find((v: VideoData) => v.id === videoId)
    const targetPlaylist = db.playlists.find((p: PlaylistData) => p.id === targetPlaylistId)

    if (!video || !targetPlaylist) return false

    const oldPlaylistId = video.playlistId
    video.playlistId = targetPlaylistId

    // Resequence videos in both playlists
    const oldPlaylistVideos = db.videos.filter((v: VideoData) => v.playlistId === oldPlaylistId)
    oldPlaylistVideos.forEach((v: VideoData, idx: number) => {
        v.sequence = idx
    })

    const newPlaylistVideos = db.videos.filter((v: VideoData) => v.playlistId === targetPlaylistId)
    newPlaylistVideos.forEach((v: VideoData, idx: number) => {
        v.sequence = idx
    })

    await saveDB(db)
    return true
}
