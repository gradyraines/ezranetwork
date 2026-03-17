import type { Connection, MatrixEntry } from '../types/network'
import type { NetworkMetrics } from '../types/metrics'
import { calculateConstraint, calculateEffectiveSize } from './burtConstraint'
import { getExplanation } from './explanations'

export function computeMetrics(
  connections: Connection[],
  matrix: MatrixEntry[]
): NetworkMetrics {
  const named = connections.filter((c) => c.name.trim())
  const n = named.length
  const namedIds = new Set(named.map((c) => c.id))

  // Count unique alter-alter ties
  const seen = new Set<string>()
  let alterAlterTies = 0
  for (const entry of matrix) {
    if (entry.strength === 'none') continue
    if (!namedIds.has(entry.sourceId) || !namedIds.has(entry.targetId)) continue
    const key = [entry.sourceId, entry.targetId].sort().join('-')
    if (seen.has(key)) continue
    seen.add(key)
    alterAlterTies++
  }

  // --- Network Size ---
  const networkSize = n

  // --- Density ---
  const possibleTies = n > 1 ? (n * (n - 1)) / 2 : 0
  const density = possibleTies > 0 ? alterAlterTies / possibleTies : 0

  // --- Burt's Constraint ---
  const constraint = calculateConstraint(connections, matrix)

  // --- Effective Size ---
  const effectiveSize = calculateEffectiveSize(connections, matrix)

  // --- Brokerage Score ---
  // Count pairs of alters NOT connected to each other
  let disconnectedPairs = 0
  for (let i = 0; i < named.length; i++) {
    for (let j = i + 1; j < named.length; j++) {
      const key = [named[i].id, named[j].id].sort().join('-')
      if (!seen.has(key)) {
        disconnectedPairs++
      }
    }
  }
  const brokerageScore = possibleTies > 0 ? disconnectedPairs / possibleTies : 0

  // --- Tie Strength Distribution ---
  const strongCount = named.filter((c) => c.tieStrength === 'strong').length
  const moderateCount = named.filter((c) => c.tieStrength === 'moderate').length
  const weakCount = named.filter((c) => c.tieStrength === 'weak').length
  const weakPct = n > 0 ? weakCount / n : 0

  // Find bridging node IDs (nodes connecting to at least 2 others not connected to each other)
  const bridgingNodeIds: string[] = []
  for (const conn of named) {
    // Find this node's alter-alter neighbors
    const neighbors = new Set<string>()
    for (const entry of matrix) {
      if (entry.strength === 'none') continue
      if (entry.sourceId === conn.id && namedIds.has(entry.targetId)) {
        neighbors.add(entry.targetId)
      }
      if (entry.targetId === conn.id && namedIds.has(entry.sourceId)) {
        neighbors.add(entry.sourceId)
      }
    }
    // Check if any pair of neighbors is disconnected
    const neighborArr = Array.from(neighbors)
    let bridges = false
    for (let i = 0; i < neighborArr.length && !bridges; i++) {
      for (let j = i + 1; j < neighborArr.length && !bridges; j++) {
        const key = [neighborArr[i], neighborArr[j]].sort().join('-')
        if (!seen.has(key)) {
          bridges = true
        }
      }
    }
    if (bridges) bridgingNodeIds.push(conn.id)
  }

  // Find weak tie edge IDs
  const weakEdgeIds = named
    .filter((c) => c.tieStrength === 'weak')
    .map((c) => `ego-${c.id}`)

  return {
    networkSize: {
      key: 'networkSize',
      label: 'Network Size',
      value: networkSize,
      formattedValue: String(networkSize),
      ...getExplanation('networkSize', networkSize),
    },
    density: {
      key: 'density',
      label: 'Network Density',
      value: density,
      formattedValue: `${(density * 100).toFixed(0)}%`,
      ...getExplanation('density', density),
    },
    constraint: {
      key: 'constraint',
      label: "Burt's Constraint",
      value: constraint,
      formattedValue: constraint.toFixed(2),
      ...getExplanation('constraint', constraint),
      highlightNodeIds: bridgingNodeIds,
    },
    effectiveSize: {
      key: 'effectiveSize',
      label: 'Effective Size',
      value: effectiveSize,
      formattedValue: effectiveSize.toFixed(1),
      ...getExplanation('effectiveSize', effectiveSize, n),
    },
    brokerageScore: {
      key: 'brokerageScore',
      label: 'Brokerage Score',
      value: brokerageScore,
      formattedValue: `${(brokerageScore * 100).toFixed(0)}%`,
      ...getExplanation('brokerageScore', brokerageScore),
      highlightNodeIds: bridgingNodeIds,
    },
    tieStrengthDistribution: {
      key: 'tieStrengthDistribution',
      label: 'Weak Tie Ratio',
      value: weakPct,
      formattedValue: `${weakCount}W / ${moderateCount}M / ${strongCount}S`,
      ...getExplanation('tieStrengthDistribution', weakPct),
      highlightEdgeIds: weakEdgeIds,
    },
  }
}
