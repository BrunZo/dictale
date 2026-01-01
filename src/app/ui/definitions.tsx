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
    <div className='flex flex-col gap-2 font-mono'>
      {definitions.map((def, i) => (
        <div key={i} className='flex flex-wrap items-start gap-x-3'>
          <span className='font-semibold'>{i+1}.</span>
          {def.words.map((word, j) => {
            const wordRevealed = isWordRevealed(i, j)
            const isClickable = revealingWord && !wordRevealed
            
            return (
              <div 
                key={j} 
                className={`flex gap-x-1 ${isClickable ? 'cursor-pointer hover:bg-yellow-100 rounded px-1' : ''}`}
                onClick={() => handleWordClick(i, j)}
                title={isClickable ? 'Click para revelar esta palabra' : ''}
              >
                {word.letters.map((letter, k) => (
                  <div 
                    className={letter.green ? 'text-green-500' : ''} 
                    key={k}
                  >
                    {letter.revealed ? letter.letter : '_'}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
