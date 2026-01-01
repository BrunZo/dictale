export default function RevealWordInput({ revealedWords, revealWordHandler }: {
  revealedWords: number[][]
  revealWordHandler: () => void
}) {
  const totalReveals = revealedWords.length
  const isDisabled = totalReveals >= 3

  return (
    <>
      <button
        className={`w-full text-white pb-2 rounded-full ${
          isDisabled 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-700'
        }`}
        onClick={() => revealWordHandler()}
        disabled={isDisabled}
      >
        <span className='text-xl font-mono'> PALABRA </span>
        <div className='flex gap-2 justify-center'>
          <div className={`w-1 h-1 rounded-full ${
            totalReveals === 0 ? 'bg-white' : 'bg-gray-300'
          }`} />
          <div className={`w-1 h-1 rounded-full ${
            totalReveals <= 1 ? 'bg-white' : 'bg-gray-300'
          }`} />
          <div className={`w-1 h-1 rounded-full ${
            totalReveals <= 2 ? 'bg-white' : 'bg-gray-300'
          }`} />
        </div>
      </button>
    </>
  )
}
