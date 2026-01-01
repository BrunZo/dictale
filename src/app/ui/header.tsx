import Link from 'next/link'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className='flex items-center py-4'>
      <div className='w-10' />
      <h2 className='text-4xl text-center font-bold grow bg-gradient-to-r bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm'>
        DICTALE
      </h2>
      <Link 
        href='/dictale/tutorial'
        className='p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-green-600'
      >
        <QuestionMarkCircleIcon width={24} height={24}/>
      </Link>
    </header>
  )
}