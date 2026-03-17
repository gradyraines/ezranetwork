import { useNetworkStore } from '../../store/useNetworkStore'

const steps = [
  { label: 'Welcome', short: 'Start' },
  { label: 'Connections', short: 'People' },
  { label: 'Who Knows Whom', short: 'Matrix' },
  { label: 'Insights', short: 'Results' },
]

export function StepIndicator() {
  const currentStep = useNetworkStore((s) => s.currentStep)

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              i === currentStep
                ? 'bg-slate-800 text-white'
                : i < currentStep
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                    ? 'bg-white text-slate-800'
                    : 'bg-slate-200 text-slate-400'
              }`}
            >
              {i < currentStep ? '\u2713' : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
            <span className="sm:hidden">{step.short}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                i < currentStep ? 'bg-emerald-300' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
