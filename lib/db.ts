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

// File-based storage functions
async function saveToFile(data: DatabaseSchema): Promise<void> {
    if (typeof window === "undefined") return;

    try {
        // In a real app, you'd save to actual files via an API
        // For now, we'll use localStorage as fallback but structure it for easy migration
        localStorage.setItem('learning_hub_db', JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save database:', error);
    }
}

async function loadFromFile(): Promise<DatabaseSchema> {
    if (typeof window === "undefined") return INITIAL_DB;

    try {
        // In a real app, you'd load from actual files via an API
        // For now, we'll use localStorage but migrate old format
        const stored = localStorage.getItem('learning_hub_db');
        if (stored) {
            const data = JSON.parse(stored);
            // Migrate old format if needed
            if (!data.playlists) {
                data.playlists = INITIAL_DB.playlists;
                // Assign existing videos to default playlist
                data.videos = data.videos?.map((v: any) => ({
                    ...v,
                    playlistId: v.playlistId || 'default'
                })) || [];
            }
            return data;
        }

        // Try to migrate from old localStorage format
        const oldStored = localStorage.getItem('vidlib_db');
        if (oldStored) {
            const oldData = JSON.parse(oldStored);
            const migratedData: DatabaseSchema = {
                videos: oldData.videos?.map((v: any) => ({
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
            await saveToFile(migratedData);
            localStorage.removeItem('vidlib_db');
            return migratedData;
        }

        return INITIAL_DB;
    } catch (error) {
        console.error('Failed to load database:', error);
        return INITIAL_DB;
    }
}

export function loadDB(): DatabaseSchema {
    // This is synchronous for compatibility, but loads from the new format
    if (typeof window === "undefined") return INITIAL_DB;

    try {
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
            return data;
        }

        // Try to migrate from old format
        const oldStored = localStorage.getItem('vidlib_db');
        if (oldStored) {
            const oldData = JSON.parse(oldStored);
            const migratedData: DatabaseSchema = {
                videos: oldData.videos?.map((v: any) => ({
                    ...v,
                    playlistId: 'default'
                })) || [],
                playlists: INITIAL_DB.playlists,
                metadata: {
                    version: "2.0",
                    lastUpdated: new Date().toISOString()
                }
            };
            saveDB(migratedData);
            localStorage.removeItem('vidlib_db');
            return migratedData;
        }

        return INITIAL_DB;
    } catch (error) {
        console.error('Failed to load database:', error);
        return INITIAL_DB;
    }
}

export function saveDB(db: DatabaseSchema): void {
    if (typeof window === "undefined") return

    db.metadata.lastUpdated = new Date().toISOString()
    localStorage.setItem('learning_hub_db', JSON.stringify(db))
}

export function addVideoToDB(videoData: Omit<VideoData, "id" | "sequence">, playlistId: string = 'default'): VideoData {
    const db = loadDB()
    const playlist = db.playlists.find(p => p.id === playlistId) || db.playlists[0]
    const playlistVideos = db.videos.filter(v => v.playlistId === playlist.id)

    const newVideo: VideoData = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        sequence: playlistVideos.length,
        ...videoData,
        playlistId: playlist.id,
    }
    db.videos.push(newVideo)
    saveDB(db)
    return newVideo
}

export function updateProgressInDB(id: string, progress: number, currentTime?: number): void {
    const db = loadDB()
    const video = db.videos.find((v) => v.id === id)
    if (video) {
        video.progress = progress
        if (currentTime !== undefined) {
            video.currentTime = currentTime
        }
        video.watched = progress >= 95
        saveDB(db)
    }
}

export function removeVideoFromDB(id: string): void {
    const db = loadDB()
    const video = db.videos.find(v => v.id === id)
    if (!video) return

    db.videos = db.videos.filter((v) => v.id !== id)
    // Resequence remaining videos in the same playlist
    const playlistVideos = db.videos.filter(v => v.playlistId === video.playlistId)
    playlistVideos.forEach((v, idx) => {
        v.sequence = idx
    })
    saveDB(db)
}

export function getVideosFromDB(playlistId?: string): VideoData[] {
    const db = loadDB()
    let videos = db.videos
    if (playlistId) {
        videos = videos.filter(v => v.playlistId === playlistId)
    }
    return videos.sort((a, b) => a.sequence - b.sequence)
}

export function getVideoByIdFromDB(id: string): VideoData | undefined {
    const db = loadDB()
    return db.videos.find((v) => v.id === id)
}

// Playlist management functions
export function createPlaylist(playlistData: Omit<PlaylistData, "id" | "createdAt" | "updatedAt">): PlaylistData {
    const db = loadDB()
    const newPlaylist: PlaylistData = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...playlistData,
    }
    db.playlists.push(newPlaylist)
    saveDB(db)
    return newPlaylist
}

export function updatePlaylist(id: string, updates: Partial<Omit<PlaylistData, "id" | "createdAt">>): PlaylistData | null {
    const db = loadDB()
    const playlist = db.playlists.find(p => p.id === id)
    if (!playlist) return null

    Object.assign(playlist, updates, { updatedAt: new Date().toISOString() })
    saveDB(db)
    return playlist
}

export function deletePlaylist(id: string): boolean {
    if (id === 'default') return false // Can't delete default playlist

    const db = loadDB()
    const playlistExists = db.playlists.some(p => p.id === id)
    if (!playlistExists) return false

    // Move all videos from this playlist to default
    db.videos.forEach(v => {
        if (v.playlistId === id) {
            v.playlistId = 'default'
        }
    })

    // Remove the playlist
    db.playlists = db.playlists.filter(p => p.id !== id)

    // Resequence videos in default playlist
    const defaultVideos = db.videos.filter(v => v.playlistId === 'default')
    defaultVideos.forEach((v, idx) => {
        v.sequence = idx
    })

    saveDB(db)
    return true
}

export function getAllPlaylists(): PlaylistData[] {
    const db = loadDB()
    return db.playlists.sort((a, b) => a.name.localeCompare(b.name))
}

export function getPlaylistById(id: string): PlaylistData | undefined {
    const db = loadDB()
    return db.playlists.find(p => p.id === id)
}

export function moveVideoToPlaylist(videoId: string, targetPlaylistId: string): boolean {
    const db = loadDB()
    const video = db.videos.find(v => v.id === videoId)
    const targetPlaylist = db.playlists.find(p => p.id === targetPlaylistId)

    if (!video || !targetPlaylist) return false

    const oldPlaylistId = video.playlistId
    video.playlistId = targetPlaylistId

    // Resequence videos in both playlists
    const oldPlaylistVideos = db.videos.filter(v => v.playlistId === oldPlaylistId)
    oldPlaylistVideos.forEach((v, idx) => {
        v.sequence = idx
    })

    const newPlaylistVideos = db.videos.filter(v => v.playlistId === targetPlaylistId)
    newPlaylistVideos.forEach((v, idx) => {
        v.sequence = idx
    })

    saveDB(db)
    return true
}
