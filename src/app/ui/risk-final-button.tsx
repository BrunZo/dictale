import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function RiskFinalButton({ riskWordToGuessHandler, disabled } : {
  riskWordToGuessHandler: () => void
  disabled?: boolean
}) {
  return (
    <div>
      <button 
        className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 rounded'}`}
        onClick={riskWordToGuessHandler}
        disabled={disabled}
      >
        <ArrowRightIcon width={24} height={24} />
      </button>
    </div>
  )
}
