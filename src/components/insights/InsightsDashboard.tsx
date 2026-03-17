import { useState, useMemo } from 'react'
import { useNetworkStore } from '../../store/useNetworkStore'
import { NetworkGraph } from '../visualization/NetworkGraph'
import { MetricCard } from './MetricCard'
import { computeMetrics } from '../../lib/metrics'
import type { Core } from 'cytoscape'

export function InsightsDashboard() {
  const connections = useNetworkStore((s) => s.connections)
  const matrix = useNetworkStore((s) => s.matrix)
  const exportData = useNetworkStore((s) => s.exportData)
  const setStep = useNetworkStore((s) => s.setStep)

  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [cyInstance, setCyInstance] = useState<Core | null>(null)

  const metrics = useMemo(
    () => computeMetrics(connections, matrix),
    [connections, matrix]
  )

  const metricList = [
    metrics.networkSize,
    metrics.density,
    metrics.constraint,
    metrics.effectiveSize,
    metrics.brokerageScore,
    metrics.tieStrengthDistribution,
  ]

  const activeMetricData = metricList.find((m) => m.key === activeMetric)

  const handleExportJSON = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'network-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPNG = () => {
    if (!cyInstance) return
    const png = cyInstance.png({ full: true, scale: 2, bg: '#ffffff' })
    const a = document.createElement('a')
    a.href = png
    a.download = 'network-visualization.png'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Your Network Insights
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Click any metric to highlight relevant parts of your network.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Export PNG
          </button>
        </div>
      </div>

      {/* Network visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 h-[450px]">
        <NetworkGraph
          height="100%"
          highlightNodeIds={activeMetricData?.highlightNodeIds}
          highlightEdgeIds={activeMetricData?.highlightEdgeIds}
          onCyReady={setCyInstance}
        />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricList.map((m) => (
          <MetricCard
            key={m.key}
            metric={m}
            isActive={activeMetric === m.key}
            onClick={() =>
              setActiveMetric(activeMetric === m.key ? null : m.key)
            }
          />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(2)}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          Back to matrix
        </button>
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  )
}
