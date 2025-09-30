import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function RiskFinalButton({ riskWordToGuessHandler } : {
  riskWordToGuessHandler: () => void
}) {
  return (
    <div>
      <button 
        className='flex items-center'
	onClick={riskWordToGuessHandler}
      >
        <ArrowRightIcon width={24} height={24} />
      </button>
    </div>
  )
}
