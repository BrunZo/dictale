import { Definition } from "../lib/defs"

export default function Definitions({ definitions }: {
  definitions: Definition[]
}) {
  return (
    <div className='flex flex-col gap-2 font-mono'>
      {definitions.map((def, i) => (
        <div key={i} className='flex flex-wrap items-start gap-x-3'>
          <span className='font-semibold'>{i+1}.</span>
          {def.words.map((word, j) => (
            <div 
              key={j} 
              className='flex gap-x-1'
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
          ))}
        </div>
      ))}
    </div>
  )
}
