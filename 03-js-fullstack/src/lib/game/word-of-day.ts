import path from 'path'
import fs from 'fs'
import type { Game } from '@shared/lib/defs'

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

let wordListCache: WordData[] | null = null

function loadWordList(): WordData[] {
  if (wordListCache) return wordListCache
  const dataPath = path.join(process.cwd(), '..', 'data', 'word_list.json')
  const data = fs.readFileSync(dataPath, 'utf-8')
  wordListCache = JSON.parse(data)
  return wordListCache!
}

export function getWordOfTheDay(): WordData {
  const wordList = loadWordList()
  const dayNumber = getDayNumber()
  const index = dayNumber % wordList.length
  return wordList[index]
}
