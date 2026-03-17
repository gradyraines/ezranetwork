import { useState } from 'react'
import type { MetricResult } from '../../types/metrics'

interface MetricCardProps {
  metric: MetricResult
  isActive: boolean
  onClick: () => void
}

export function MetricCard({ metric, isActive, onClick }: MetricCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-4 rounded-lg border transition-all ${
        isActive
          ? 'border-amber-400 bg-amber-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-sm font-semibold text-slate-700">{metric.label}</h4>
        <span className="text-lg font-bold text-slate-800 ml-2 shrink-0">
          {metric.formattedValue}
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-2 italic">
        {metric.theoryConnection}
      </p>

      <p className="text-sm text-slate-600 leading-relaxed">
        {metric.explanation}
      </p>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-sm text-emerald-700 font-medium leading-relaxed">
            {metric.insight}
          </p>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
        }}
        className="mt-2 text-xs text-slate-400 hover:text-slate-600 underline"
      >
        {expanded ? 'Hide insight' : 'Show actionable insight'}
      </button>
    </button>
  )
}
