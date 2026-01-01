import clsx from 'clsx';
import { Definition } from "../lib/defs"

export default function Definitions({ definitions, revealingWord, revealedWords, onWordClick }: {
  definitions: Definition[]
  revealingWord?: boolean
  revealedWords?: number[][]
  onWordClick?: (position: number[]) => void
}) {
  const isWordRevealed = (defIndex: number, wordIndex: number): boolean => {
    return revealedWords?.some(pos => pos[0] === defIndex && pos[1] === wordIndex) || false
  }

  const handleWordClick = (defIndex: number, wordIndex: number) => {
    if (revealingWord && onWordClick) {
      onWordClick([defIndex, wordIndex])
    }
  }

  return (
    <div className='flex flex-col gap-4 font-mono'>
      {definitions.map((def, i) => (
        <div key={i} className='flex flex-wrap items-start gap-x-4 gap-y-2'>
          <span className={clsx({
            'font-bold text-lg text-indigo-600 min-w-[24px]': true,
            'px-2 py-1': revealingWord
          })}>
            {i+1}.
          </span>
          {def.words.map((word, j) => {
            const wordRevealed = isWordRevealed(i, j)
            const isClickable = revealingWord && !wordRevealed
            
            return (
              <div 
                key={j} 
                className={clsx(
                  'flex gap-x-1 transition-all duration-200',
                  revealingWord ? 'px-2 py-1' : '',
                  isClickable 
                    ? 'cursor-pointer hover:bg-yellow-100 hover:shadow-md rounded-lg transform hover:scale-105' 
                    : ''
                )}
                onClick={() => handleWordClick(i, j)}
                title={isClickable ? 'Click para revelar esta palabra' : ''}
              >
                {word.letters.map((letter, k) => (
                  <span 
                    className={clsx(
                      'text-xl font-bold transition-colors duration-200',
                      letter.green ? 'text-green-600' : letter.revealed ? 'text-gray-800' : 'text-gray-400'
                    )} 
                    key={k}
                  >
                    {letter.revealed ? letter.letter : '_'}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
