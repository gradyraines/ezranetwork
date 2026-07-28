export interface MetricResult {
  key: string
  label: string
  value: number
  formattedValue: string
  theoryConnection: string
  explanation: string
  highlightNodeIds?: string[]
  highlightEdgeIds?: string[]
}

export interface NodeMetrics {
  connectionId: string
  name: string
  degreeCentrality: number
  constraint: number
  clusterLabel: number
}

export interface NetworkMetrics {
  networkSize: MetricResult
  density: MetricResult
  constraint: MetricResult
  effectiveSize: MetricResult
  brokerageScore: MetricResult
  tieStrengthDistribution: MetricResult
}
