import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Game } from '@shared/lib/defs'
import { getWordOfTheDay } from '@/lib/game/word-of-day'
import { createGame } from '@/lib/game/store'
import { gameToStateView } from '@/lib/game/serialize'

export async function POST() {
  try {
    const wordData = getWordOfTheDay()
    const game = new Game(wordData.word, wordData.definitions)
    const gameId = uuidv4()
    createGame(gameId, game)
    const state = gameToStateView(game)
    return NextResponse.json({ gameId, state })
  } catch (err) {
    console.error('Error creating game:', err)
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
