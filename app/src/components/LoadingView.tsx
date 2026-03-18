import { useState, useEffect } from 'react'
import LoadingSkeleton from './LoadingSkeleton'

const STEPS = [
  'Anfrage wird vorverarbeitet',
  'Relevante Förderungen werden ausgewählt',
  'KI bewertet Passgenauigkeit',
  'Ergebnis wird aufbereitet',
]

const STEP_DELAYS = [0, 900, 2400, 4500]

interface Props {
  userInput: string
}

export default function LoadingView({ userInput }: Props) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = STEP_DELAYS.slice(1).map((delay, i) =>
      setTimeout(() => setActiveStep(i + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">

      {/* Status Card */}
      <div className="bg-white border border-[#D4D1CB] rounded-2xl p-6 mb-6 shadow-sm">

        {/* Header row */}
        <div className="flex items-center gap-4 mb-5">
          <div className="shrink-0 w-11 h-11 rounded-full border border-[#0D4F6B]/20 flex items-center justify-center">
            <svg className="animate-spin text-[#0D4F6B]" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15"/>
              <path d="M13 3A10 10 0 0 1 23 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1A1A1A] text-[15px] leading-snug">KI analysiert deine Anfrage</p>
            <p className="text-[13px] text-[#9B998F] mt-0.5">Durchsuche 103 Förderungen in Liechtenstein…</p>
          </div>
        </div>

        {/* Query */}
        <div className="bg-[#F8F7F4] rounded-xl px-4 py-3 mb-5 border border-[#EAE8E4]">
          <p className="text-[10px] text-[#9B998F] uppercase tracking-widest font-bold mb-1">Deine Anfrage</p>
          <p className="text-[13px] text-[#1A1A1A] italic leading-relaxed">„{userInput}"</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((label, i) => {
            const done = i < activeStep
            const active = i === activeStep
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  done
                    ? 'border-[#0D4F6B] bg-[#0D4F6B]'
                    : active
                    ? 'border-[#0D4F6B]'
                    : 'border-[#D4D1CB]'
                }`}>
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active ? (
                    <div className="w-2 h-2 rounded-full bg-[#0D4F6B] animate-pulse"/>
                  ) : null}
                </div>
                <span className={`text-[13px] transition-colors duration-300 ${
                  done ? 'text-[#6B6860] line-through decoration-[#B0ADA5]' : active ? 'text-[#1A1A1A] font-medium' : 'text-[#C0BDB5]'
                }`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <LoadingSkeleton />
    </div>
  )
}
