import type { Connection, MatrixEntry } from '../types/network'

const TIE_WEIGHTS: Record<string, number> = {
  strong: 3,
  moderate: 2,
  weak: 1,
}

/**
 * Calculate Burt's network constraint for the ego node.
 *
 * Constraint measures how much of ego's network is invested in contacts
 * who are themselves connected. High constraint = redundant network.
 *
 * C_ij = (p_ij + sum_q(p_iq * p_qj))^2
 * Total constraint = sum_j(C_ij)
 */
export function calculateConstraint(
  connections: Connection[],
  matrix: MatrixEntry[]
): number {
  const named = connections.filter((c) => c.name.trim())
  const n = named.length
  if (n < 2) return 0

  // Build adjacency map with weights (among alters only)
  const adj = new Map<string, Map<string, number>>()
  for (const c of named) {
    adj.set(c.id, new Map())
  }

  const seen = new Set<string>()
  for (const entry of matrix) {
    if (entry.strength === 'none') continue
    const key = [entry.sourceId, entry.targetId].sort().join('-')
    if (seen.has(key)) continue
    seen.add(key)
    const w = TIE_WEIGHTS[entry.strength] || 1
    adj.get(entry.sourceId)?.set(entry.targetId, w)
    adj.get(entry.targetId)?.set(entry.sourceId, w)
  }

  // Ego's investment proportions: p_ij = w_ij / sum(w_ik)
  // For ego, tie weight to each alter comes from the connection's tieStrength
  const egoWeights = new Map<string, number>()
  let totalEgoWeight = 0
  for (const c of named) {
    const w = TIE_WEIGHTS[c.tieStrength] || 2
    egoWeights.set(c.id, w)
    totalEgoWeight += w
  }

  // Proportional investment from ego to each alter
  const p_ego = new Map<string, number>()
  for (const c of named) {
    p_ego.set(c.id, (egoWeights.get(c.id) || 0) / totalEgoWeight)
  }

  // For each alter j, compute constraint C_ij
  let totalConstraint = 0
  for (const j of named) {
    const p_ij = p_ego.get(j.id) || 0

    // Indirect paths: sum over q != i, j of p_iq * p_qj
    // p_qj = whether q is connected to j (and the weight proportion from q's perspective)
    let indirect = 0
    for (const q of named) {
      if (q.id === j.id) continue
      const p_iq = p_ego.get(q.id) || 0
      // Is q connected to j among alters?
      const qj_weight = adj.get(q.id)?.get(j.id) || 0
      if (qj_weight > 0) {
        // Proportion of q's total connections that go to j
        const qTotal = Array.from(adj.get(q.id)?.values() || []).reduce(
          (sum, v) => sum + v,
          0
        )
        const p_qj = qTotal > 0 ? qj_weight / qTotal : 0
        indirect += p_iq * p_qj
      }
    }

    const c_ij = (p_ij + indirect) ** 2
    totalConstraint += c_ij
  }

  return totalConstraint
}

/**
 * Calculate Burt's effective network size.
 *
 * Simplified formula: n - (2t/n)
 * where n = number of alters, t = number of alter-alter ties
 *
 * Effective size measures non-redundant contacts.
 */
export function calculateEffectiveSize(
  connections: Connection[],
  matrix: MatrixEntry[]
): number {
  const named = connections.filter((c) => c.name.trim())
  const n = named.length
  if (n === 0) return 0

  // Count unique alter-alter ties
  const seen = new Set<string>()
  const namedIds = new Set(named.map((c) => c.id))
  let ties = 0
  for (const entry of matrix) {
    if (entry.strength === 'none') continue
    if (!namedIds.has(entry.sourceId) || !namedIds.has(entry.targetId)) continue
    const key = [entry.sourceId, entry.targetId].sort().join('-')
    if (seen.has(key)) continue
    seen.add(key)
    ties++
  }

  return n - (2 * ties) / n
}
