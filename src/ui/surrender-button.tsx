import { FlagIcon } from '@heroicons/react/24/outline';

export default function SurrenderButton() {
  return (
    <div>
      <button className='flex items-center justify-center p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 hover:shadow-md transform hover:scale-110 active:scale-95'>
        <FlagIcon width={24} height={24} />
      </button>
    </div>
  )
}