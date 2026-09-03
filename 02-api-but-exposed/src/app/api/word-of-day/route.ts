import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export interface WordData {
  word: string
  definitions: string[]
}

function getDayNumber(referenceDate: Date = new Date('2025-01-01')): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  referenceDate.setHours(0, 0, 0, 0)
  const diffTime = today.getTime() - referenceDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), '..', 'data', 'word_list.json')
    const data = fs.readFileSync(dataPath, 'utf-8')
    const wordList: WordData[] = JSON.parse(data)
    const dayNumber = getDayNumber()
    const index = dayNumber % wordList.length
    const wordData = wordList[index]
    return NextResponse.json(wordData)
  } catch (err) {
    console.error('Error loading word list:', err)
    return NextResponse.json({ error: 'Failed to load word' }, { status: 500 })
  }
}
