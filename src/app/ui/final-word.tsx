import { useState, useEffect, useRef } from "react";
import { WordToGuess, Letter } from "../lib/defs";

export default function FinalWord({ wordToGuess, onFinalWordChange }: {
  wordToGuess: WordToGuess
  onFinalWordChange: (string) => void
}) {
  const [finalWord, setFinalWord] = useState('_'.repeat(wordToGuess.content.length))
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const letterChangeHandler = (index: number, value: string) => {
    setFinalWord(finalWord
		 .split('')
		 .map((c: string, i: number) => i == index ? value : c)
		 .join(''))
  }

  useEffect(() => {
    onFinalWordChange(finalWord)
  }, [finalWord])
  
  return (
    <span className='flex grow justify-center gap-1'>
      {wordToGuess.letters.map((c, i) => {
        return <LetterField 
          key={i} 
          letter={c} 
          focused={focusedIndex == i}
	  onChange={(value: string) => letterChangeHandler(i, value)}
          onFull={() => setFocusedIndex(i + 1)}
          onEmpty={() => setFocusedIndex(i - 1)}
        />
      })}
    </span>
  );
}

export function LetterField({ letter, focused, onChange, onFull, onEmpty }: {
  letter: Letter
  focused: boolean
  onChange: (value: string) => void
  onFull: () => void
  onEmpty: () => void
}) {
  const [value, setValue] = useState('')
  const [valueAfter, setValueAfter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(value.length, value.length)
    }
  }, [focused, value]);

  const changeHandler = (letter: string) => {
    setValue(letter)
    onChange(letter || '_')
    if (letter != '') {
      setValueAfter(letter)
      onFull();
    }
  };

  return (
    <input 
      ref={inputRef}
      className='text-xl font-mono w-4 border-b border-black text-center uppercase'
      value={value}
      maxLength={1}
      onChange={e => changeHandler(e.target.value)}
      onKeyUp={e => {
        if (e.key == 'Backspace' && valueAfter == '') 
          onEmpty()
        else if (e.key == 'ArrowLeft') 
          onEmpty()
        else if (e.key == 'ArrowRight') 
          onFull()
  	else if (value != '')
	  onFull()
  	setValueAfter(value)
      }}
    />
  );
}
