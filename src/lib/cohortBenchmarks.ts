import type { ClassicMetrics } from './classicMetrics'

// Historical cohort averages from the original Ezra's Network tool
// (constants.py DEFAULTS). The two Tech MBA year-cohorts are merged into a
// single "Tech MBA" population by averaging them.

export interface CohortBenchmark {
  key: string
  label: string
  values: ClassicMetrics
}

export const COHORT_BENCHMARKS: CohortBenchmark[] = [
  {
    key: 'techMba',
    label: 'Tech MBA',
    values: {
      numTies: 52.5,
      netDensity: 0.37,
      higherRank: 0.35,
      sameRank: 0.4,
      lowerRank: 0.245,
      notInOrg: 0.49,
      yourUnit: 0.22,
      veryCloseTies: 0.285,
      closeTies: 0.44,
      econResources: 0.235,
      careerResources: 0.54,
      getThingsDoneResources: 0.625,
      socialResources: 0.585,
      emotionalTrust: 3.12,
      getThingsDoneTrust: 3.98,
      obligation: 3.4,
    },
  },
  {
    key: 'seniorExecs',
    label: 'Senior Executives',
    values: {
      numTies: 65,
      netDensity: 0.46,
      higherRank: 0.29,
      sameRank: 0.39,
      lowerRank: 0.32,
      notInOrg: 0.59,
      yourUnit: 0.19,
      veryCloseTies: 0.3,
      closeTies: 0.5,
      econResources: 0.22,
      careerResources: 0.25,
      getThingsDoneResources: 0.47,
      socialResources: 0.61,
      emotionalTrust: 2.85,
      getThingsDoneTrust: 3.49,
      obligation: 2.81,
    },
  },
  {
    key: 'fullTimeMba',
    label: 'Full-Time MBA',
    values: {
      numTies: 30,
      netDensity: 0.41,
      higherRank: 0.29,
      sameRank: 0.33,
      lowerRank: 0.3,
      notInOrg: 0.37,
      yourUnit: 0.36,
      veryCloseTies: 0.15,
      closeTies: 0.42,
      econResources: 0.33,
      careerResources: 0.26,
      getThingsDoneResources: 0.64,
      socialResources: 0.34,
      emotionalTrust: 2.27,
      getThingsDoneTrust: 3.82,
      obligation: 3.54,
    },
  },
]

export type MetricFormat = 'int' | 'pct' | 'rating'

export interface MetricRowDef {
  key: keyof ClassicMetrics
  label: string
  format: MetricFormat
  group: string
}

export const METRIC_ROWS: MetricRowDef[] = [
  { key: 'numTies', label: 'Number of ties', format: 'int', group: 'Network structure' },
  { key: 'netDensity', label: 'Network density', format: 'pct', group: 'Network structure' },
  { key: 'veryCloseTies', label: 'Very close ties', format: 'pct', group: 'Network structure' },
  { key: 'closeTies', label: 'Close ties', format: 'pct', group: 'Network structure' },
  { key: 'higherRank', label: 'Higher rank than you', format: 'pct', group: 'Composition' },
  { key: 'sameRank', label: 'Same rank as you', format: 'pct', group: 'Composition' },
  { key: 'lowerRank', label: 'Lower rank than you', format: 'pct', group: 'Composition' },
  { key: 'notInOrg', label: 'Outside your organization', format: 'pct', group: 'Composition' },
  { key: 'yourUnit', label: 'In your unit', format: 'pct', group: 'Composition' },
  { key: 'econResources', label: 'Economic / financial', format: 'pct', group: 'Resources' },
  { key: 'careerResources', label: 'Entrepreneurial info', format: 'pct', group: 'Resources' },
  { key: 'getThingsDoneResources', label: 'Help executing tasks', format: 'pct', group: 'Resources' },
  { key: 'socialResources', label: 'Friendship & support', format: 'pct', group: 'Resources' },
  { key: 'emotionalTrust', label: 'Emotional trust', format: 'rating', group: 'Trust & obligation' },
  { key: 'getThingsDoneTrust', label: 'Task trust', format: 'rating', group: 'Trust & obligation' },
  { key: 'obligation', label: 'Sense of obligation', format: 'rating', group: 'Trust & obligation' },
]

export function formatMetricValue(value: number, format: MetricFormat): string {
  switch (format) {
    case 'int':
      return Number.isInteger(value) ? String(value) : value.toFixed(1)
    case 'pct':
      return `${(value * 100).toFixed(0)}%`
    case 'rating':
      return value.toFixed(1)
  }
}
