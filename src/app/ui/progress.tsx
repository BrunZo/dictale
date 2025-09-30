export default function Progress({ progress }: {
  progress: number
}) {
  return (
    <div className='relative border rounded-full'>
      <div 
        className={`bg-green-200 rounded-full h-6`}
        style={{ width: `${progress}%` }}
      />
      <div className='absolute top-0 w-full h-full text-center'>
        {progress}%
      </div>
    </div>
  )
}