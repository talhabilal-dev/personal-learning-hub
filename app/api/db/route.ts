import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db', 'db.json')

export async function GET() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8')
        return NextResponse.json(JSON.parse(data))
    } catch (error) {
        console.error('Failed to read database:', error)
        return NextResponse.json(
            { error: 'Failed to read database' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to write database:', error)
        return NextResponse.json(
            { error: 'Failed to write database' },
            { status: 500 }
        )
    }
}