'use client';

import { useState } from 'react';
import { produce } from 'immer';
import clsx from 'clsx';

import Header from './ui/header';
import Target from './ui/target';
import SurrenderButton from './ui/surrender-button';
import RiskFinalButton from './ui/risk-final-button';
import FinalWord from './ui/final-word';
import Definitions from './ui/definitions';
import Progress from './ui/progress';
import GuessWordInput from './ui/guess-word-input';
import RevealLetterInput from './ui/reveal-letter';
import RevealWordInput from './ui/reveal-word';
import { Game } from './lib/defs';

const errorMessages = {
  'empty': 'Por favor, ingrese una palabra.',
  'not-found': 'La palabra ingresada no es correcta.',
  'not-full': 'Complete la palabra.',
  'already-guessed': 'La palabra ya fue adivinada.',
  'invalid-letter': 'Por favor, ingrese una letra.',
  'already-revealed': 'La letra ya fue revelada.',
  'invalid-position': 'Posición inválida.',
  'no-reveals-left': 'Ya has usado todas tus pistas.',
  'no-letters-left': 'Ya has usado todas tus pistas.',
  'wrong': 'Incorrecto.',
  'ok': '',
}

export default function Page() 
{
  const [game, setGame] = useState<Game>(new Game('vida', ['Hecho de estar vivo.']))

  const [finalWord, setFinalWord] = useState<string>('')
  const [guessedWordError, setGuessedWordError] = useState<string>('')
  const [revealingWord, setRevealingWord] = useState<boolean>(false)
  const [gameEnded, setGameEnded] = useState<boolean>(false)
  const [gameWon, setGameWon] = useState<boolean>(false)

  const riskWordToGuess = () => {
    if (gameEnded) return
    
    if (finalWord.includes('_') || !finalWord) {
      setGuessedWordError('Por favor, complete la palabra final.')
      return
    }

    setGame(produce(game, draft => {
      const response = draft.riskWordToGuess(finalWord)
      if (response === 'correct') {
        setGameWon(true)
        setGameEnded(true)
      } else if (response === 'wrong') {
        setGameWon(false)
        setGameEnded(true)
      } else {
        setGuessedWordError(errorMessages[response] || 'Error desconocido.')
      }
    }))
  }
  
  const guessWord = (prompt: string) => {
    if (gameEnded) return
    
    setGame(produce(game, draft => {
      const response = draft.guessWord(prompt)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const revealLetter = (letter: string) => {
    if (gameEnded) return
    
    setGame(produce(game, draft => {
      const response = draft.guessLetter(letter)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const startRevealWord = () => {
    if (gameEnded) return
  
    if (game.revealedWords.length >= 3) {
      setGuessedWordError(errorMessages['no-reveals-left'])
      return
    }
    
    setRevealingWord(!revealingWord)
    setGuessedWordError('')
  }

  const revealWord = (position: number[]) => {
    if (gameEnded || !revealingWord) return
    
    setGame(produce(game, draft => {
      const response = draft.revealWord(position)
      if (response === 'ok')
        setRevealingWord(false)
      else
        setGuessedWordError(errorMessages[response] || 'Error al revelar palabra.')
    }))
  }

  const progress = Math.floor(100 * game.getRevealedLetterCount() / game.getLetterCount())

  return (
    <div className='flex flex-col items-center relative'>
      {revealingWord && (
        <div className='fixed inset-0 bg-black bg-opacity-20 z-0' />
      )}
      <div className='flex flex-col gap-2 unselectable pt-3 w-1/3 relative z-10'>
        <div className={clsx({
          'blur-sm opacity-50 pointer-events-none': revealingWord
        })}>
          <Header />
          <hr />
          <div className='relative mt-4 mb-2'>
            <div className='flex justify-center gap-2'>
              <SurrenderButton />
              <FinalWord wordToGuess={game.wordToGuess} onFinalWordChange={setFinalWord}/>
              <RiskFinalButton riskWordToGuessHandler={riskWordToGuess} disabled={gameEnded} />
            </div>
          </div>
        </div>
        <div className={`border rounded-md p-2 relative z-20 ${revealingWord ? 'ring-4 ring-yellow-400 ring-opacity-50 shadow-2xl bg-white' : ''}`}>
          <div className='bg-icon-container'>
            <i className='fa fa-bookmark top-left-bookmark' />
          </div>
          <Definitions 
            definitions={game.definitions}
            revealingWord={revealingWord}
            revealedWords={game.getFullyRevealedWordPositions()}
            onWordClick={revealWord}
          />
        </div>
        <div className={clsx({
          'blur-sm opacity-50 pointer-events-none': revealingWord,
          'flex flex-col gap-2': true,
        })}>
          <Progress progress={progress}/>
          <div className='flex flex-col gap-4'>
            <div className='flex-1'>
              <GuessWordInput 
                guessWordHandler={guessWord} 
                errorMsg={guessedWordError}
              />
            </div>
            {game.failedWords.length > 0 && (
              <div className='flex-shrink-0 w-full border rounded-md p-2'>
                <div className='text-sm font-semibold underline mb-1'>
                  Fallos ({game.failedWords.length})
                </div>
                <ul className='text-xs space-y-1'>
                  {game.failedWords.length > 6 ? (
                    <>
                      {game.failedWords.slice(0, 2).map((word, i) => (
                        <li key={i}>{word.toUpperCase()}</li>
                      ))}
                      <li className='text-gray-500'>...</li>
                      {game.failedWords.slice(-3).map((word, i) => (
                        <li key={game.failedWords.length - 3 + i}>{word.toUpperCase()}</li>
                      ))}
                    </>
                  ) : (
                    game.failedWords.map((word, i) => (
                      <li key={i}>{word.toUpperCase()}</li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className='flex justify-center gap-4 mt-1'>
            <RevealLetterInput
              revealedLetters={game.revealedLetters}
              revealLetterHandler={revealLetter}
            />
            <RevealWordInput 
              revealedWords={game.revealedWords}
              revealWordHandler={startRevealWord}
            />
          </div>
          {gameEnded && (
            <div className='mt-4 p-4 border rounded-md text-center'>
              <div className={`text-2xl font-bold ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
                {gameWon ? '¡Has adivinado la palabra!' : 'Más suerte la próxima vez...'}
              </div>
              <div className='mt-2 text-sm text-gray-600'>
                La palabra era: <span className='font-bold'>{game.wordToGuess.content.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
