import type { ClassicMetrics } from '../../lib/classicMetrics'
import {
  COHORT_BENCHMARKS,
  METRIC_ROWS,
  formatMetricValue,
} from '../../lib/cohortBenchmarks'

interface ClassComparisonProps {
  metrics: ClassicMetrics
}

export function ClassComparison({ metrics }: ClassComparisonProps) {
  const groups: string[] = []
  for (const row of METRIC_ROWS) {
    if (!groups.includes(row.group)) groups.push(row.group)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-base font-bold text-slate-800">How You Compare</h3>
      <p className="text-sm text-slate-500 mt-0.5 mb-3">
        Your scores next to historical averages from other populations that
        completed this exercise.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th scope="col" className="text-left py-2 pr-3 font-medium text-slate-500">
                Metric
              </th>
              <th scope="col" className="text-right py-2 px-3 font-semibold text-slate-800 bg-amber-50 rounded-t-lg">
                You
              </th>
              {COHORT_BENCHMARKS.map((cohort) => (
                <th
                  key={cohort.key}
                  scope="col"
                  className="text-right py-2 px-3 font-medium text-slate-500 whitespace-nowrap"
                >
                  {cohort.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <GroupRows key={group} group={group} metrics={metrics} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Historical averages come from earlier cohorts of this exercise. Higher
        is not always better. The right profile depends on your goals.
      </p>
    </div>
  )
}

function GroupRows({
  group,
  metrics,
}: {
  group: string
  metrics: ClassicMetrics
}) {
  const rows = METRIC_ROWS.filter((r) => r.group === group)
  return (
    <>
      <tr>
        <td
          colSpan={2 + COHORT_BENCHMARKS.length}
          className="pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide"
        >
          {group}
        </td>
      </tr>
      {rows.map((row) => (
        <tr key={row.key} className="border-b border-slate-100">
          <td className="py-1.5 pr-3 text-slate-600">{row.label}</td>
          <td className="py-1.5 px-3 text-right font-semibold text-slate-800 bg-amber-50">
            {formatMetricValue(metrics[row.key], row.format)}
          </td>
          {COHORT_BENCHMARKS.map((cohort) => (
            <td key={cohort.key} className="py-1.5 px-3 text-right text-slate-500">
              {formatMetricValue(cohort.values[row.key], row.format)}
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
