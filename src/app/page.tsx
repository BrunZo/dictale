'use client';

import { useState } from 'react';
import { produce } from 'immer';

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
  'already-guessed': 'La palabra ya fue adivinada.',
  'invalid-letter': 'Por favor, ingrese una letra.',
  'already-revealed': 'La letra ya fue revelada.',
  'ok': '',
  'wrong': 'Incorrecto.'
}

export default function Page() 
{
  const [game, setGame] = useState<Game>(new Game('vida', ['Hecho de estar vivo.']))

  const [finalWord, setFinalWord] = useState<string>('')
  const [guessedWordError, setGuessedWordError] = useState<string>('')
  const [revealingWord, setRevealingWord] = useState<bool>(false)

  const riskWordToGuess = (prompt: string) => {
    setGame(produce(game, draft => {
      const response = draft.riskWordToGuess(finalWord)
      console.log(finalWord)
      setGuessedWordError(errorMessages[response])
    }))
  }
  
  const guessWord = (prompt: string) => {
    setGame(produce(game, draft => {
      const response = draft.guessWord(prompt)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const revealLetter = (letter: string) => {
    setGame(produce(game, draft => {
      const response = draft.revealLetter(letter)
      setGuessedWordError(errorMessages[response])
    }))
  }

  const startRevealWord = () => {
    setRevealingWord(!revealingWord)
  }

  const revealWord = (position: number[]) => {
    // TODO
  }

  const progress = Math.floor(100 * game.getRevealedLetterCount() / game.getLetterCount())

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col gap-2 unselectable pt-3 w-1/3'>
        <div className={revealingWord ? 'screen-blur' : 'screen-blur hidden'} />
        <Header />
        <hr />
        <div className='relative mt-2'>
          <div className='flex justify-center gap-2'>
            <SurrenderButton />
            <FinalWord wordToGuess={game.wordToGuess} onFinalWordChange={setFinalWord}/>
            <RiskFinalButton riskWordToGuessHandler={riskWordToGuess} />
          </div>
          <Target />
        </div>
        <div className='border rounded-md p-2'>
          <div className='bg-icon-container'>
            <i className='fa fa-bookmark top-left-bookmark' />
          </div>
          <Definitions definitions={game.definitions}/>
        </div>
        <Progress progress={progress}/>
        <GuessWordInput 
          guessWordHandler={guessWord} 
          errorMsg={guessedWordError}
        />
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
        { /*
        <Message/>
        <EndGame/>
        */ }
      </div>
    </div>
  );
}
