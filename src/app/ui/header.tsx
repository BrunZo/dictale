import Link from 'next/link'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className='flex items-center py-2'>
      <h2 className='text-4xl text-center font-mono grow'> DICTALE </h2>
      <Link href='/dictale/tutorial'>
        <QuestionMarkCircleIcon width={24} height={24}/>
      </Link>
    </header>
  )
}