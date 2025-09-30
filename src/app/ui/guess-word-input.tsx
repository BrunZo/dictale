'use client';

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function GuessWordInput({ guessWordHandler, errorMsg }: {
  guessWordHandler: (value: string) => void,
  errorMsg: string
}) {
  const [word, setWord] = useState('')
  
  const clickHandler = (word: string) => {
    if (!word) return
    guessWordHandler(word)
    setWord('')
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-4'>
        <input 
          className='grow border rounded-full text-center h-10 uppercase'
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && clickHandler(word)}
        />
        <button 
          className='flex items-center justify-center border rounded-full bg-green-500 text-white w-10 h-10'
          onClick={() => clickHandler(word)}
        >
          <ArrowRightIcon width={24} height={24} />
        </button>
      </div>
      <div>
        {errorMsg && <span className='text-red-600 text-sm'> {errorMsg} </span>}
      </div>
    </div>
  )
}