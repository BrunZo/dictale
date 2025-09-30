export default function RevealWordInput({ revealedWords, revealWordHandler }: {
  revealedWords: number[][]
  revealWordHandler: () => void
}) {
  return (
    <>
      <button
        className='w-full bg-green-500 hover:bg-green-700 text-white pb-2 rounded-full'
        onClick={() => revealWordHandler()}
      >
        <span className='text-xl font-mono'> PALABRA </span>
        <div className='flex gap-2 justify-center'>
          <div className='w-1 h-1 bg-white rounded-full' />
          <div className='w-1 h-1 bg-white rounded-full' />
          <div className='w-1 h-1 bg-white rounded-full' />
        </div>
      </button>
    </>
  )
}
