export interface VideoData {
    id: string
    name: string
    sequence: number
    duration: number
    progress: number
    currentTime: number
    watched: boolean
    addedAt: string
}

interface DatabaseSchema {
    videos: VideoData[]
    metadata: {
        version: string
        lastUpdated: string
    }
}

const DB_KEY = "vidlib_db"
const INITIAL_DB: DatabaseSchema = {
    videos: [],
    metadata: {
        version: "1.0",
        lastUpdated: new Date().toISOString(),
    },
}

export function loadDB(): DatabaseSchema {
    if (typeof window === "undefined") return INITIAL_DB

    const stored = localStorage.getItem(DB_KEY)
    return stored ? JSON.parse(stored) : INITIAL_DB
}

export function saveDB(db: DatabaseSchema): void {
    if (typeof window === "undefined") return

    db.metadata.lastUpdated = new Date().toISOString()
    localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export function addVideoToDB(videoData: Omit<VideoData, "id" | "sequence">): VideoData {
    const db = loadDB()
    const newVideo: VideoData = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        sequence: db.videos.length,
        ...videoData,
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
    db.videos = db.videos.filter((v) => v.id !== id)
    // Resequence remaining videos
    db.videos.forEach((v, idx) => {
        v.sequence = idx
    })
    saveDB(db)
}

export function getVideosFromDB(): VideoData[] {
    const db = loadDB()
    return db.videos.sort((a, b) => a.sequence - b.sequence)
}

export function getVideoByIdFromDB(id: string): VideoData | undefined {
    const db = loadDB()
    return db.videos.find((v) => v.id === id)
}
