'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useState } from 'react';

export default function RevealLetterInput({ revealedLetters, revealLetterHandler }: {
  revealedLetters: string[]
  revealLetterHandler: (value: string) => void
}) {
  const inputRef = React.createRef<HTMLInputElement>()
  const divRef = React.createRef<HTMLDivElement>()

  const [inputValue, setInputValue] = useState<string>('')
  const [inputHidden, setInputHidden] = useState<boolean>(true)

  useEffect(() => {
    document.addEventListener('mousedown', (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node))
        setInputHidden(true)
      return () => document.removeEventListener('mousedown', () => { })
    })
  }, [divRef, inputRef])

  useEffect(() => {
    if (!inputHidden)
      inputRef.current?.focus()
  }, [inputHidden, inputRef])

  const clickHandler = () => {
    if (inputHidden && revealedLetters.length < 3) {
      setInputHidden(false)
      return
    }
    if (!inputValue) {
      setInputHidden(true)
      return
    }
    setInputValue('')
    revealLetterHandler(inputValue)
    setInputHidden(true)
  }

  return (
    <div ref={divRef} className='relative flex flex-col w-full'>
      <button
        className={clsx({
          'w-full text-white pb-2 rounded-full': true,
          'bg-green-500 hover:bg-green-700': revealedLetters.length < 3,
          'bg-gray-300 cursor-not-allowed': revealedLetters.length === 3
        })}
        onClick={clickHandler}
      >
        <span className='text-xl font-mono'> LETRA </span>
        <div className='flex gap-2 justify-center'>
          <div className={clsx({
            'w-1 h-1 rounded-full': true,
            'bg-white': revealedLetters.length === 0,
            'bg-gray-300': revealedLetters.length > 0
          })} />
          <div className={clsx({
            'w-1 h-1 rounded-full': true,
            'bg-white': revealedLetters.length <= 1,
            'bg-gray-300': revealedLetters.length > 1
          })} />
          <div className={clsx({
            'w-1 h-1 rounded-full': true,
            'bg-white': revealedLetters.length <= 2,
            'bg-gray-300': revealedLetters.length > 2
          })} />
        </div>
      </button>
      <div className={clsx({
        'absolute top-full left-2/3 w-12 h-12 rounded-b-md border-x-2 border-b-2 border-gray-200 p-1': true,
        'hidden': inputHidden
      })}>
        <input
          ref={inputRef}
          value={inputValue}
          type='text'
          className='w-full h-full text-center text-2xl uppercase border-b-2 border-gray-500'
          maxLength={1}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') clickHandler() }}
        />
      </div>
    </div>
  )
}